---
title: Datafeeds
description: A near-real-time outbound feed of changes in Kaizen, delivered to your webhook as signed HTTP POSTs.
---



## What is it?

We expose a near-real-time outbound data feed over webhooks. When things change in Kaizen (e.g. a customer is updated), we send a signed HTTP POST to your webhook URL containing a standard envelope (metadata about the event) and the payload (the object itself).

Four object types are available: `customer`, `order`, `product` and `tagType` (see [Object Schemas](#object-schemas)). You receive the ones configured for your integration.

## Getting Started

1. Give us a publicly reachable HTTPS URL to POST events to
2. Generate a random shared secret and share it with us securely
3. Build an endpoint that returns a fast 2xx and verifies our signature

## Detailed Requirements
To consume the feed effectively, please ensure the following technical requirements are met:

### 1. Provide a webhook URL

* Publicly reachable over HTTPS
* This is the endpoint we will POST events to

### 2. Provide a shared secret

* A random string you generate and share with us
* We configure it against your integration on our side
* We use it to sign the request body and send an X-Kaizen-Signature header
* **This is critical for security**: You must verify this signature to ensure the webhook request genuinely comes from Kaizen and hasn't been tampered with or sent by a malicious third party

### 3. A small HTTP endpoint that:

* Accepts POST requests
* Requires Content-Type: application/json
* **Verifies X-Kaizen-Signature using HMAC SHA-256** over the raw body + shared secret (see [Security](#security-and-shared-secret) section below)
* **Returns a quick 2xx response** (ideally within 3 seconds):
  * This should be a fast acknowledgment that you've received the webhook
  * If you need to perform heavy processing (database writes, API calls, business logic), **queue the work asynchronously** on your side and return 2xx immediately
  * Slow responses may trigger timeouts and unnecessary retries

All routing (which organisations + object types you receive) is configured by us.

## Webhook envelope format

Every POST you receive will be a JSON envelope with a consistent shape, wrapping the actual payload:

```json
{
  "envelopeVersion": 1,
  "publishedAt": "2025-02-01T12:34:56.789Z",
  "eventType": "Updated",
  "organisationId": "00000000-0000-0000-0001-000000000004",
  "objectType": "customer",
  "objectVersion": 1,
  "objectId": "accnt_6f1c2a9e-3b7d-4e2a-9c41-0d8b5e7f2a13",
  "idempotencyKey": "…hash…",
  "sourceSystem": "Kaizen",
  "payload": {}
}
```

### Field descriptions

* `envelopeVersion` - Version of the envelope schema (currently 1). This may increment if we make breaking changes to the envelope structure
* `publishedAt` - Timestamp of when the event was published by Kaizen (UTC, ISO 8601)
* `eventType` - The type of change that occurred:
  * `Created` - A new object was created
  * `Updated` - An existing object was modified
  * `Deleted` - Deleted events correspond to a hard deletion inside Kaizen. After a Deleted event for a given objectId, that object no longer exists in Kaizen. The payload for a Deleted event contains the last known state of the object at the time it was deleted.
* `organisationId` - The unique identifier of the Kaizen organisation (club) this event belongs to. Use this value to route each message to the correct tenant in your system
* `objectType` - The type of object (e.g. customer). This determines the schema of the payload
* `objectVersion` - Version number of the object schema in the payload. Increments when we make changes to the object structure. Use this to handle different payload versions
* `objectId` - The unique identifier of the specific object within Kaizen, prefixed by its kind (e.g. `accnt_…` for a customer's account ID, `order_…` for an order)
* `idempotencyKey` - A unique hash for this specific event. Use this to deduplicate if you receive the same event multiple times (see Idempotency)
* `sourceSystem` - Always Kaizen
* `payload` - The actual object data. For update events, this is the full payload each time, not just changed fields

## Headers & authentication

Each webhook POST will include the following headers:

* **X-Kaizen-Event** – mirrors eventType (e.g. Updated)
* **X-Kaizen-Source** – Always Kaizen
* **X-Idempotency-Key** – mirrors idempotencyKey in the envelope
* **X-Kaizen-Signature** – HMAC-SHA256 (hex) of the raw request body, computed with the shared secret. NOTE: The value is prefixed with sha256= (e.g., sha256=a2b14dabsdw) **You must verify this to ensure authenticity**
* **traceparent** – The [W3C Trace Context](https://www.w3.org/TR/trace-context/) of the change inside Kaizen. Its trace ID is the same on every retry of a change, so quote it to us when you need us to trace a delivery. One change in Kaizen can publish several events with the same trace ID, so deduplicate with `idempotencyKey`, not the trace ID
* **tracestate** – Sent alongside `traceparent` when Kaizen has trace state to pass on

## Retry / resilience behaviour

### Delivery guarantees

Kaizen provides **at-least-once delivery**. This means:

* Every event will be delivered to your webhook at least once
* In rare cases (network issues, timeouts, retries), you may receive the same event multiple times

### How retries work

When we send a webhook to your endpoint:

* **2xx response** → Success. We consider the event delivered and will not retry
* **5xx response, 408, 429, a timeout or a network error** → Temporary failure. We retry the delivery with exponential backoff (see below)
* **Any other 4xx response** → Client error. We log it and do not retry, as it indicates a problem with the request or your endpoint's configuration (for example a signature you could not verify). That event is not redelivered automatically

### Retry schedule

* The first retry follows after about 10 seconds, and the wait doubles with each attempt up to a maximum of 10 minutes between attempts
* We keep retrying until the event is delivered, or until it is 7 days old (see [Retention Period](#retention-period))
* There is no dead letter queue - an event is either retried or, after 7 days, discarded
* An event that keeps failing for more than a few minutes is reported on our side, so we can see a stuck integration

## Retention Period

Undelivered events are retained and retried for **7 days** from when they were published. After this period:

* An event that has still not been delivered is discarded
* We do not guarantee redelivery of events older than 7 days
* **If your webhook is offline for an extended period:** During the 7-day window, you won't miss anything as failed deliveries are retried automatically. Beyond it, we can replay data by republishing from our side. Coordinate with us to discuss backfilling options if needed

### Idempotency on your side

Because of our **at-least-once delivery** guarantee, you may receive the same event multiple times. Additionally, **events may arrive out of order** due to retries and network conditions.

**How to handle this safely:**

1. **Use idempotencyKey to detect duplicates:**
   - Extract the idempotencyKey from the incoming webhook
   - Check if you've already processed this key (e.g., look it up in your database)
   - If yes → Return 200 immediately without reprocessing
   - If no → Process the event, store the idempotencyKey, then return 200

**Retention of idempotency keys:** You only need to retain idempotencyKey values for as long as retries are possible (at least 7 days - see [Retention Period](#retention-period)). After that, the risk of receiving duplicates is negligible.

### Handling out-of-order delivery 
Because events can be retried and replayed, you may ocassionally recieve an older event after you've already processed a more recent one for the same object. To guard against overwriting newer data with a stale update, compare the incoming **publishedAt** timestamp against the **publishedAt** value you have stored for that **objectId**. If the incoming event is older, discard it and return 200. 


## Security and Shared Secret

**Critical: You must verify the webhook signature to ensure requests genuinely come from Kaizen.**

Without signature verification, anyone could send fake webhooks to your endpoint and inject malicious data into your system.

### How it works

1. We agree on a shared secret string with you (generated by you, shared securely)
2. On every webhook, we compute HMAC-SHA256 of the raw request body using the shared secret and hex-encode it
3. We send that value in the X-Kaizen-Signature header

### What you need to do

**You are responsible for verifying the signature.** This is your security mechanism to prevent unauthorized or tampered webhooks.

1. Read the raw request body (before parsing JSON)
2. Read the X-Kaizen-Signature header
3. Recompute HMAC-SHA256(rawBody, sharedSecret) using the same secret and hex-encode it
4. The header value will arrive formatted as "sha256=<hex>"
5. Add 'sha256=' to the front of the hash you just calculated, then compare the two values (use a constant-time comparison to prevent timing attacks)
6. If they match → Trust the request and process it
7. If they don't match, treat as suspicious (log and return 4xx)

## Date/Time Format

All datetime fields use **UTC** and follow the **ISO 8601** standard. We use different representations where appropriate:

* **Instant** ([NodaTime Instant](https://nodatime.org/2.4.x/userguide/instant-patterns)) for absolute times such as created or updated
* **LocalDate** ([NodaTime LocalDate](https://nodatime.org/2.4.x/userguide/localdate-patterns)) for date-only values such as dateOfBirth (YYYY-MM-DD)
* **LocalDateTime** ([NodaTime LocalDateTime](https://nodatime.org/2.4.x/userguide/localdatetime-patterns)) where both date and time are relevant but no time zone offset applies

## Object Schemas

Currently supported object types:

### Customer Object

For objectType: "customer"

* [Customer Schema Sample](/datafeeds/Customer.Sample.json)

**Key fields:**

* **accountId:** Primary key. Shared between clubs if the same email address is used
* **profileId:** Unique per club
* **organisationId:** The ID of the owning club the record belongs to
* **foreignOrganisationId:** Used when a profile has been generated through Kaizen Network
* **Phone numbers:** Not verified; free text field
* **Null fields:** Fields that are unset are set to null
* **Consent:** Refers to marketing consent. Different consents can be registered for a club for different organisations. Consent timestamps are stored internally but unlikely to be exposed through feeds at this time
* **Current balances:** Snapshot of the customer's current balance. Transaction history is not included in this object

### Order Object

For objectType: "order"

* [Order Schema Sample](/datafeeds/Order.Sample.json)


**Key concepts:**

* **Primary key:** `order.id` (same as objectId in the webhook envelope)
* **Attendees:** One order may contain multiple order lines, and each line can have its own attendee
* **isCancelled:** Indicates that the specific order line has been cancelled
* **priceTypeId vs priceCategoryId:**
  * `priceTypes` relate to WHO is buying the ticket (Adult, child, etc.)
  * `priceCategory` relates to the seats themselves (Standing, seated, etc.)

### Product Object

For objectType: "product"

* [Product Schema Sample](/datafeeds/Product.Sample.json)


**Product types available on the Kaizen platform:**

* Event
* MembershipType
* Merchandise
* Donation
* Package
* Remote

### TagType Object

For objectType: "tagType"

* [TagType Schema Sample](/datafeeds/TagType.Sample.json)


**Key concepts:**

* **openToPurchaser & openToAttendee:** Both are collections of tag-based eligibility filters. `openToPurchaser` applies to the purchaser of the order; `openToAttendee` applies to the attendee assigned to a specific order line
* **Tag combinations:** Tag conditions can be combined logically using the `openTo` and `closedTo` fields.
* **flags:** Possible values include: None, Purchase, Reserve, Allocate, ConfirmReservation, ConfirmAllocation, AcceptForwarded, PurchaseFromResale


