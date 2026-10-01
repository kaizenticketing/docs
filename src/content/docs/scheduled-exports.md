---
title: Scheduled Exports
description: Data files written to a private Google Cloud Storage folder for you to collect on your own schedule.
---


Welcome, and thanks for working with us. This guide should give your technical team everything they need to start collecting data files from us. If anything here is unclear, or you would like us to set things up differently, just ask.

## The short version

We write files into a folder in Google Cloud Storage that only you can read. You collect them whenever it suits you.

**There is no code of ours for you to run, and no particular language you need to use.** Nothing to install, no framework to adopt, and no design of ours to build to. If your software can make an HTTPS request, it can collect these files. Plenty of partners simply run a scheduled command and never write any code at all.

**The storage is on our Google Cloud account and we pay for it.** There is nothing for you to set up with Google, no account to open and no storage or transfer costs coming your way.

## What we will send you

Alongside this guide, your Kaizen contact will give you:

1. **The full path to your folder** - something like `gs://ticketing-prod-247511_integrations/00000000-0000-0000-0000-000000000001/your-name/`
2. **A key file** - a small JSON file that is the only credential you need
3. **The columns in each file**, the format, and when they will arrive

Please treat the key file as you would a password. It opens your folder and nothing else of ours. If it is ever lost or shared by accident, tell us and we will replace it straight away - no drama.

## Collecting your files

The simplest approach, and the one we would suggest starting with, is Google's `gcloud` command line tool on a schedule. No code required:

```bash
# sign in once, using the key file we sent you
gcloud auth activate-service-account --key-file=your-key-file.json

# see what is waiting for you - use `ls` here: `gcloud storage objects list` treats a
# folder URL as an exact object name and silently prints nothing
gcloud storage ls gs://ticketing-prod-247511_integrations/00000000-0000-0000-0000-000000000001/your-name/

# take a copy
gcloud storage cp gs://ticketing-prod-247511_integrations/.../your-name/barcodes_MATCH123_20260618.csv ./
```

If you would rather do it from your own application, here are the same two steps in a few languages.

### C#

```csharp
// dotnet add package Google.Cloud.Storage.V1
var credential = GoogleCredential.FromFile("your-key-file.json");
var storage = StorageClient.Create(credential);

const string bucket = "ticketing-prod-247511_integrations";
const string prefix = "00000000-0000-0000-0000-000000000001/your-name/";

foreach (var file in storage.ListObjects(bucket, prefix))
{
    Console.WriteLine($"{file.Name} last written {file.Updated:u}");

    using var output = File.Create(Path.GetFileName(file.Name));
    storage.DownloadObject(bucket, file.Name, output);
}
```

### JavaScript / Node

```javascript
// npm install @google-cloud/storage
const { Storage } = require("@google-cloud/storage");

const storage = new Storage({ keyFilename: "your-key-file.json" });
const bucket = storage.bucket("ticketing-prod-247511_integrations");
const prefix = "00000000-0000-0000-0000-000000000001/your-name/";

const [files] = await bucket.getFiles({ prefix });
for (const file of files) {
    console.log(file.name, file.metadata.updated);
    await file.download({ destination: file.name.split("/").pop() });
}
```

### Delphi

Google do not publish a Delphi library, so there are two sensible routes.

**The easy one** is to let the `gcloud` command line tool do the work and call it from your application. This avoids all of the authentication handling:

```pascal
// downloads everything currently in the folder into a local directory
ShellExecute(0, 'open', 'gcloud',
  PChar('storage cp -r gs://ticketing-prod-247511_integrations/' +
        '00000000-0000-0000-0000-000000000001/your-name/* C:\Imports\'),
  nil, SW_HIDE);
```

**The direct one** is the storage REST API over HTTPS, which is a plain JSON call:

```pascal
uses System.Net.HttpClient, System.NetEncoding;

var
  Http: THTTPClient;
  Response: IHTTPResponse;
  Url, Token: string;
begin
  // see the note below on obtaining Token
  Url := 'https://storage.googleapis.com/storage/v1/b/' +
         'ticketing-prod-247511_integrations/o?prefix=' +
         TNetEncoding.URL.Encode('00000000-0000-0000-0000-000000000001/your-name/');

  Http := THTTPClient.Create;
  try
    Http.CustomHeaders['Authorization'] := 'Bearer ' + Token;
    Response := Http.Get(Url);
    // Response.ContentAsString returns JSON listing each file, with its
    // .. name, size, updated timestamp and a mediaLink to download it
  finally
    Http.Free;
  end;
end;
```

To get `Token`, the key file has to be exchanged for a short-lived access token. That means signing a JWT with RS256, so you will need a JWT or OpenSSL library. If that is more bother than it is worth, run `gcloud auth print-access-token` and read its output - the tokens last an hour.

Happy to talk this through if it would help.

## When your files arrive

Which of these applies to you depends on what we have set up. You may have more than one.

| Set up to run | When the file appears |
| --- | --- |
| Every night | A few minutes after midnight, in the club's own local time |
| When an onsale ends | A few minutes after it ends - normally under ten |
| When an event finishes | A few minutes after the last gates close - normally under ten |

The nightly one is predictable. **The other two are not** - a club can end an onsale at any time of day, so files can turn up at any hour.

## One file for each product

The two event driven cases give you **one file per product** rather than one file covering everything.

If three matches come off sale at the same time, you get three files, each holding one match. The file name tells you which - see below.

## What the files are called

**This is yours to choose.** We set the name when we configure your export, so tell us what suits your software and we will use it. There is no fixed naming scheme you have to work around.

What you pick from is a fixed piece of text plus any of these, which we fill in for each file:

| Put this in the name | We replace it with | Example |
| --- | --- | --- |
| `{Date}` | the date, `yyyyMMdd` | `20260618` |
| `{Time}` | the time, `HHmmss` | `221545` |
| `{DateTime}` | both, `yyyyMMdd_HHmmss` | `20260618_221545` |
| `{ProductCode}` | the club's own code for the match or event | `MATCH123` |
| `{ProductId}` | our unique id for it | `9f1c…` |

Dates and times are the club's own local clock, not UTC. A product code is stable - the same match always carries the same one - so it is the better of the two to key your own records on.

Some names those give you:

| Name we would configure | What you receive |
| --- | --- |
| `sales_{Date}.csv` | `sales_20260618.csv` - one per night, building up a history |
| `barcodes_{ProductCode}.csv` | `barcodes_MATCH123.csv` - one per match, replaced if we send it again |
| `barcodes_{ProductCode}_{DateTime}.csv` | `barcodes_MATCH123_20260618_221545.csv` - every delivery kept separately |

**Include something that varies.** A name containing `{Date}`, `{DateTime}` or `{ProductCode}` leaves you a folder of distinct files you can work through and keep. A name with none of them is a single file we overwrite in place, which we would rather avoid: you only ever hold the most recent one, and if you are not watching closely you can miss a delivery entirely. If you do want that, we can set it up - just tell us, so we can talk through how you will spot each update.

One rule we will apply for you: an export that fires **when an onsale ends or an event finishes** must carry `{ProductCode}` or `{ProductId}`, because it produces a file per product and without one they would all land on top of each other.

## What is inside the files

Each export is driven by a saved report we set up for the club. Please talk to us about **which of the available columns you need** while we are getting your integration going, and we will build the report around that.

The first row is always the column headings.

**If that report is later changed, your next file reflects it.** A column added, removed or renamed will show up in the next export rather than the one after, so it is worth telling us if your import is strict about what it expects - we can then agree any change with you before it goes in. Reading the heading row rather than counting column positions will also survive a column being added.

## A few practical notes

- **CSV files are UTF-8 and begin with a byte order mark.** Most tools handle this, but if you see three odd characters at the start of the first column, that is what they are.
- **You will never see a half written file.** Files appear complete or not at all, so it is safe to collect one the moment you spot it.
- **Please make your import repeatable.** If one of our runs has to be retried, you may occasionally receive the same file twice. Ignoring one you have already taken is the safest way to handle it.

## Knowing what is new

Poll the folder on a schedule - every ten minutes suits most partners, and more often gains you very little given the timings above.

**List the folder and look for names you have not seen before.** Please do not try to predict the next file name: you cannot know in advance when a club will end an onsale, or which matches it covers.

If we have set you up with a fixed name that gets replaced, check the timestamp instead:

```bash
gcloud storage objects describe gs://ticketing-prod-247511_integrations/.../your-name/your-file.csv \
    --format="value(updated, generation, md5Hash)"
```

- `updated` - when we last wrote it
- `generation` - a number that changes every time we replace it
- `md5Hash` - to confirm your download arrived intact

## If something does not look right

Get in touch with your usual Kaizen contact and let us know:

- the full name of the file
- when you expected it
- what you found instead - nothing at all, or a file that did not look right

Do please tell us rather than polling harder; if a file is missing, more requests will not bring it back, and we would much rather hear about it.
