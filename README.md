# Bloomreach Discovery – Server-Side GTM Template

> ⚠️ **Experimental Template**
>
> This custom Google Tag Manager Server-Side template is still experimental.  
> Before implementing, you **must contact your Bloomreach Discovery Account Manager** to ensure that server-side tracking is enabled and properly configured for your account.

---

## Overview

This repository contains a custom Google Tag Manager Server-Side (GTMSS) tag template for integrating Bloomreach Discovery via a server-side pixel implementation.

The template enables you to send Bloomreach Discovery tracking events from your server-side GTM container, allowing:

- Improved data control
- First-party data routing
- Enhanced privacy compliance
- Reduced client-side tracking exposure
- More reliable event delivery

---

## What This Template Does

The template:

- Receives event data from client-side GTM or other sources
- Transforms event payloads into the Bloomreach Discovery format
- Sends HTTP requests to the Bloomreach Discovery tracking endpoint
- Supports ecommerce events such as:
  - Product views
  - Category views
  - Search events
  - Add-to-cart
  - Purchase
- Allows configurable merchant/account identifiers
- Handles event mapping via server-side variables
- Enables structured item array processing

---

## Architecture

Typical setup:

Browser → Web GTM → Server-Side GTM → Bloomreach Endpoint

### Flow

1. Client-side events are pushed into the dataLayer.
2. Web GTM forwards relevant events to GTM Server-Side.
3. GTMSS triggers this custom Bloomreach template.
4. The template formats and sends the request to Bloomreach Discovery.

---

## Prerequisites

Before installing:

- Bloomreach Discovery account
- Server-Side GTM container deployed
- Custom domain configured for GTMSS
- Bloomreach account configured for server-side tracking
- Tracking endpoint details from Bloomreach
- Required authentication parameters (if applicable)

---

## Installation

1. Open your GTM Server-Side container
2. Navigate to:
   Templates → Tag Templates → New
3. Click:
   Import
4. Upload the file:
   Bloomreach Discovery (Server-side Pixel).tpl
5. Save the template.

---

## Tag Configuration

After importing:

1. Create a new Tag
2. Select:
   Bloomreach Discovery – Server-side
3. Configure the required fields.

### Required Fields

- Account / Merchant ID
- Tracking Endpoint
- Environment (if applicable)

### Event Mapping

Map incoming server-side event data to:

- Event name
- Product ID
- Category
- Search query
- Transaction ID
- Revenue
- Currency
- Items array

Ensure the structure matches Bloomreach’s required schema.

---

## Recommended Client-Side Configuration

Your web container should:

- Forward ecommerce events to server container
- Include structured items array
- Include transaction-level metadata
- Ensure consistent naming conventions

Example forwarded event:

```javascript
{
  event: "purchase",
  transaction_id: "T12345",
  value: 129.99,
  currency: "EUR",
  items: [
    {
      item_id: "SKU123",
      item_name: "Product Name",
      price: 129.99,
      quantity: 1
    }
  ]
}
```

---

## Testing & Validation

1. Enable Preview Mode in GTM Server-Side.
2. Trigger test events.
3. Verify:
   - Tag fires correctly
   - HTTP request is sent
   - Response status is successful
4. Confirm events are visible in Bloomreach reporting.

If events do not appear:

- Verify endpoint URL
- Confirm account is enabled for server-side tracking
- Validate required parameters
- Check server logs for errors

---

## Deployment

Once validated:

1. Publish your GTM Server-Side container.
2. Monitor:
   - Event volumes
   - Error rates
   - Bloomreach ingestion logs

---

## Versioning

It is recommended to:

- Use Git version control for template updates
- Document changes in a CHANGELOG.md
- Test updates in staging before production deployment

---

## Security & Privacy Notes

- Ensure GDPR/consent compliance before sending data
- Avoid sending PII unless explicitly allowed
- Validate all incoming payload data
- Use a first-party server domain

---

## Support

This template is not officially maintained by Bloomreach.

For platform-level activation, endpoint configuration, or account enablement:
Contact your Bloomreach Discovery Account Manager.

---

## Disclaimer

This template is provided as-is, without warranty.  
Always validate against Bloomreach’s official implementation guidelines before deploying to production.
