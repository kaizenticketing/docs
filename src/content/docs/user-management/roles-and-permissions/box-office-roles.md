---
title: Box Office Roles
description: The box office roles, the menus each one sees and what it can do in each.
---

Each role below lists the menus it sees and what it can do in each. Anything not listed is hidden for that role.

A user with more than one role gets everything from all of them. A user with no role sees nothing.

## Kaizen users

Users in the Kaizen organisation (Root) with a KZ or SU role have access to every organisation. To limit a Kaizen user to selected clubs, see [Give a Kaizen user access to selected clubs](/user-management/give-a-kaizen-user-access-to-selected-clubs/).

**Kaizen User (KZ)** can do everything a club can, plus the Kaizen-only features below.

**Super User (SU)** can do everything a club can. It does not have the Kaizen-only features below.

## Kaizen only

Only the Kaizen User role (KZ) has these:

- Resynchronise product inventory
- Republish products, orders and access tokens
- Rebuild the data warehouse for a season
- Customer origins and customer tiers
- Kaizen administration tools (Integrations, User Management, Administration)
- Onsales dashboard and an onsales expected demand
- Cancel, import stock take, take scheduled payments and timed reports batches, parallel printing, fatally failed batches and document rebuilds
- Template source code, fixed templates and draft previews
- The shared library: the fixed templates and assets Kaizen shares with every organisation
- Admin-only report columns, report notes and caveats, and report scans with no date limit
- Delete every applied tag of a tag type
- Relative points in time
- Internal ids, last scan times and seat map debug overlays
- An organisation's code, name, short name and timezone, activating organisations, and channels
- Shown only to Kaizen users for now, although TM and SUP hold the permission: venues, attractions, fees & discounts, document templates, and unlocking inventory from report results

## KZ - Kaizen User

*Everything a Super User has, plus every Kaizen-only feature. Only the Kaizen organisation can grant this role.*

### Everything a club can do

- Every menu and action a club role can have (see [TM](#tm---ticketing-manager) below)

### Home / Analytics

- Onsales dashboard

### Customers menu

- Customer origins
- Customer tiers
- Delete every applied tag of a tag type

### Customer account

- The quota usage link on a customer's account

### Customer orders

- Unlock locked lines from the reservations page

### Products

- Resynchronise product inventory
- Republish products, orders and access tokens
- Rebuild the data warehouse for a season
- Set an onsale's expected demand
- Manage attractions

### Venues

- Add, edit and archive venues
- Import a venue configuration that creates venue entities

### Reporting

- Scheduled exports
- Admin-only report columns
- Report notes and caveats
- Report scans with no date limit
- Unlock inventory from report results

### Automation

- Create cancel, import stock take, take scheduled payments and timed reports batches
- Allow parallel execution on print batches
- Re-run or close a fatally failed batch

### Organisation

- Change an organisation's code, name, short name and timezone
- Manage fees & discounts
- Manage document templates
- Rebuild organisation documents
- Manage channels
- Edit template source code and fixed templates, preview drafts, and view MJML code
- Manage the fixed templates and assets Kaizen shares with every organisation

### Integrations, User Management and Administration

- CRM, access control and webhook integrations
- User Management
- Activate and deactivate organisations
- Payment providers, sender configurations, tracking analytics, tax bands and countries
- Republish entities and flush the cache

### Everywhere

- Internal ids, last scan times and seat map debug overlays
- Relative points in time

**Does not see:** Organisation settings (a Kaizen user manages organisations from Administration)

## TM - Ticketing Manager

*Should see and do almost everything a club can.*

### Home / Analytics

- Sales dashboard
- Match day dashboard

### Selling

- Complete a sale at checkout
- Reserve tickets instead of buying
- Allocate and confirm allocations
- Use the channel content editor
- Sell from the products list

### Customers menu

- Search for customers
- Merge customer accounts
- Create and manage tag types
- Manage restriction reasons

### Customer account

- Update a customer's account
- Email a customer
- Send a password reset
- Erase a customer account
- View order history and customer timeline
- View a customer's reservations
- Manage friends & family
- View and accept forwarded tickets
- View balances
- Adjust balances
- View loyalty points
- Adjust loyalty points
- Add and remove customer tags
- Apply and release customer restrictions
- View and reset a customer's quota usage

### Customer orders

- Cancel orders or order lines
- Cancel order lines back into a cart
- Print and reprint tickets
- Unissue tickets
- Resend order confirmations
- Dispatch and redispatch
- Post and cancel ticket forwarding
- Post and cancel ticket resale
- Allocate and confirm allocations
- Reclass inventory
- Force-unlock inventory on an order

### Products

- Add, edit, archive and take products off sale
- Copy products
- View product reports and door lists
- Edit posting configurations on products
- Share products on the Kaizen Network
- Lapse products
- Manage attractions
- See Brands
- Add and edit brands
- Archive brands
- See Price Categories
- Add and edit price categories
- Archive price categories
- See Price Types
- Add and edit price types
- Archive price types
- See Product Categories
- Add and edit product categories
- Archive product categories
- See Reporting Categories
- Add and edit reporting categories
- Archive reporting categories
- See Seasons
- Add and edit seasons

### Venues

- Add and edit venues
- Archive venues
- Add, edit and copy venue configurations
- Import and export venue configurations
- Add, edit and archive holds
- See seat maps

### Reporting

- My Reports
- Transactions and sub-transactions reports
- Payments report
- Payouts report
- Customers report
- Inventory report
- Free stuck seats from the inventory report
- Sales report
- Fulfilment report

### Fan Engagement

- Campaigns, audiences and bulk mail

### Automation

- Manage rule groups
- Manage quotas
- Create and run batches

### Organisation

- Manage entitlements
- Manage methods of payment
- Manage methods of delivery
- Manage payment plans
- Manage fees & discounts
- Manage ticket templates
- Manage notification templates
- Manage document templates
- Download and rebuild organisation documents

### Workstation

- Configure a workstation

### Support

- Support pages

**Does not see:** -

## SUP - Supervisor

*Like TM but no payouts, payment/delivery admin, entitlements, rule groups, quotas.*

### Home / Analytics

- Sales dashboard
- Match day dashboard

### Selling

- Complete a sale at checkout
- Reserve tickets instead of buying
- Allocate and confirm allocations
- Sell from the products list

### Customers menu

- Search for customers
- Merge customer accounts
- Create and manage tag types
- Manage restriction reasons

### Customer account

- Update a customer's account
- Email a customer
- Send a password reset
- Erase a customer account
- View order history and customer timeline
- View a customer's reservations
- Manage friends & family
- View and accept forwarded tickets
- View balances
- Adjust balances
- View loyalty points
- Adjust loyalty points
- Add and remove customer tags
- Apply and release customer restrictions
- View and reset a customer's quota usage

### Customer orders

- Cancel orders or order lines
- Cancel order lines back into a cart
- Print and reprint tickets
- Unissue tickets
- Resend order confirmations
- Dispatch and redispatch
- Post and cancel ticket forwarding
- Post and cancel ticket resale
- Allocate and confirm allocations
- Reclass inventory
- Force-unlock inventory on an order

### Products

- Add, edit, archive and take products off sale
- Copy products
- View product reports and door lists
- Edit posting configurations on products
- Lapse products
- Manage attractions
- See Brands
- Add and edit brands
- Archive brands
- See Price Categories
- Add and edit price categories
- Archive price categories
- See Price Types
- Add and edit price types
- Archive price types
- See Product Categories
- Add and edit product categories
- Archive product categories
- See Reporting Categories
- Add and edit reporting categories
- Archive reporting categories
- See Seasons
- Add and edit seasons

### Venues

- Add and edit venues
- Archive venues
- Add, edit and copy venue configurations
- Import and export venue configurations
- Add, edit and archive holds

### Reporting

- My Reports
- Transactions and sub-transactions reports
- Payments report
- Customers report
- Inventory report
- Free stuck seats from the inventory report
- Sales report
- Fulfilment report

### Fan Engagement

- Campaigns, audiences and bulk mail

### Automation

- Create and run batches

### Organisation

- Manage ticket templates
- Manage notification templates

### Workstation

- Configure a workstation

### Support

- Support pages

**Does not see:** -

## FIN - Finance

*Reports + balances, no selling.*

### Home / Analytics

- Sales dashboard

### Selling

- See the Sales menu and the sales channel

### Customers menu

- Search for customers

### Customer account

- View order history and customer timeline
- View balances
- Adjust balances

### Customer orders

- View only - no actions

### Products

- View product reports and door lists

### Reporting

- My Reports
- Transactions and sub-transactions reports
- Payments report
- Payouts report
- Customers report
- Sales report
- Fulfilment report

### Organisation

- Download and rebuild organisation documents

### Workstation

- Configure a workstation

**Does not see:** Venues, Fan Engagement, Automation, Support

## MRK - Marketing

*Customers, tags, campaigns, batches - no selling.*

### Home / Analytics

- Sales dashboard

### Selling

- Use the channel content editor

### Customers menu

- Search for customers
- Merge customer accounts
- Create and manage tag types
- Manage restriction reasons

### Customer account

- Update a customer's account
- Email a customer
- Erase a customer account
- Add and remove customer tags
- Apply and release customer restrictions

### Products

- View product reports and door lists

### Reporting

- My Reports
- Transactions and sub-transactions reports
- Customers report
- Sales report
- Fulfilment report

### Fan Engagement

- Campaigns, audiences and bulk mail

### Automation

- Create and run batches

### Organisation

- Manage ticket templates
- Manage notification templates

**Does not see:** Customer orders, Venues, Workstation, Support

## MC - Media / Content

*Content: brands, product categories, templates, seat maps.*

### Selling

- Use the channel content editor

### Venues

- See seat maps

### Organisation

- Manage ticket templates
- Manage notification templates

**Does not see:** Home / Analytics, Customers menu, Customer account, Customer orders, Products, Reporting, Fan Engagement, Automation, Workstation, Support

## WS - Window Seller

*Till user: sell, reprint, cancel - no admin.*

### Home / Analytics

- Match day dashboard

### Selling

- Complete a sale at checkout
- Sell from the products list

### Customers menu

- Search for customers

### Customer account

- Update a customer's account
- Email a customer
- Send a password reset
- View order history and customer timeline
- View a customer's reservations
- Manage friends & family
- View and accept forwarded tickets
- View balances
- View loyalty points

### Customer orders

- Print and reprint tickets
- Unissue tickets
- Resend order confirmations
- Dispatch and redispatch
- Post and cancel ticket forwarding
- Post and cancel ticket resale
- Reclass inventory

### Products

- View product reports and door lists
- Edit posting configurations on products

### Reporting

- My Reports

### Workstation

- Configure a workstation

**Does not see:** Venues, Fan Engagement, Automation, Organisation, Support

## EXEC - Executive

*Read-only: analytics + reports.*

### Home / Analytics

- Sales dashboard
- Match day dashboard

### Reporting

- My Reports
- Transactions and sub-transactions reports
- Payments report
- Payouts report
- Customers report
- Inventory report
- Sales report
- Fulfilment report

### Organisation

- Download and rebuild organisation documents

**Does not see:** Selling, Customers menu, Customer account, Customer orders, Products, Venues, Fan Engagement, Automation, Workstation, Support

## IT - IT / Administrator

*Automation, templates, workstation - no customers or sales.*

### Automation

- Manage rule groups
- Manage quotas
- Create and run batches

### Organisation

- Manage ticket templates
- Manage notification templates

### Workstation

- Configure a workstation

**Does not see:** Home / Analytics, Selling, Customers menu, Customer account, Customer orders, Products, Venues, Reporting, Fan Engagement, Support
