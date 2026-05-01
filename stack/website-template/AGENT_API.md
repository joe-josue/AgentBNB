# Your Property — Agent API Reference

Base URL: `https://yourproperty.com/api/admin`  
Auth: `Authorization: Bearer <ADMIN_API_KEY>`

All endpoints return JSON. All write operations require the Authorization header.
The `/api/availability` endpoint is public (no auth required).

---

## Inquiries

Inquiries are submitted by guests via the public contact form at `/api/inquire`.  
Each inquiry has a **row number** (Sheet1 row) used as its identifier.  
Statuses: `Pending` | `Approved` | `Rejected`

### List all inquiries
```
GET /api/admin/inquiries
Authorization: Bearer <ADMIN_API_KEY>
```
Response:
```json
{
  "inquiries": [
    {
      "row": 2,
      "timestamp": "04/08/2026, 10:30 AM",
      "name": "Juan dela Cruz",
      "email": "juan@example.com",
      "phone": "+63 912 345 6789",
      "checkIn": "2026-04-15",
      "checkOut": "2026-04-16",
      "headcount": 8,
      "stayType": "overnight",
      "message": "Is the pool available?",
      "estimatedTotal": "Estimated total: ₱12,490.00 (1 night(s)) — soft launch pricing",
      "status": "Pending",
      "bookingId": null,
      "notes": null
    }
  ]
}
```

### Approve an inquiry (creates booking, sends confirmation email)
```
POST /api/admin/inquiries/:row/approve
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{ "notes": "Optional internal note" }
```
Response:
```json
{
  "booking": {
    "id": "uuid-v4",
    "checkIn": "2026-04-15",
    "checkOut": "2026-04-16",
    "guestName": "Juan dela Cruz",
    "guestEmail": "juan@example.com",
    "headcount": 8,
    "stayType": "overnight",
    "total": "Estimated total: ₱12,490.00 ...",
    "source": "direct",
    "inquiryRow": 2,
    "createdAt": "04/08/2026, 10:35 AM"
  }
}
```
Side effects:
- Creates row in Sheet2 (Bookings) → blocks those dates on public calendar
- Updates Sheet1 row: Status=Approved, Booking ID=uuid
- Sends confirmation email to guest
- Sends notification to owner

### Reject an inquiry
```
POST /api/admin/inquiries/:row/reject
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{ "notes": "Dates unavailable", "sendEmail": true }
```
- `sendEmail` (bool, optional) — if true, sends a polite decline email to guest  
Response:
```json
{ "success": true, "row": 2, "status": "Rejected" }
```

---

## Bookings

Bookings are the source of truth for blocked dates. Created automatically when an inquiry is approved, or manually via this API.

### List all bookings
```
GET /api/admin/bookings
Authorization: Bearer <ADMIN_API_KEY>
```
Response:
```json
{
  "bookings": [
    {
      "id": "uuid-v4",
      "checkIn": "2026-04-15",
      "checkOut": "2026-04-16",
      "guestName": "Juan dela Cruz",
      "guestEmail": "juan@example.com",
      "headcount": 8,
      "stayType": "overnight",
      "total": "₱12,490.00",
      "source": "direct",
      "inquiryRow": 2,
      "notes": null,
      "createdAt": "04/08/2026, 10:35 AM"
    }
  ]
}
```

### Get a single booking
```
GET /api/admin/bookings/:id
Authorization: Bearer <ADMIN_API_KEY>
```

### Create a manual booking (block dates without an inquiry)
```
POST /api/admin/bookings
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{
  "checkIn": "2026-05-01",
  "checkOut": "2026-05-03",
  "guestName": "Family Reunion",
  "guestEmail": "optional@example.com",
  "headcount": 10,
  "stayType": "overnight",
  "notes": "Owner block"
}
```
Response: `{ "booking": { ...Booking } }` with HTTP 201

### Cancel a booking (unblocks dates)
```
DELETE /api/admin/bookings/:id
Authorization: Bearer <ADMIN_API_KEY>
```
Response: `{ "success": true, "deleted": "uuid" }`

### Send Thank You email (closing the loop)
```
POST /api/admin/bookings/:id/thank-you
Authorization: Bearer <ADMIN_API_KEY>
```
- Sends a styled Thank You email to the guest via Resend.
- Includes a link to the guest review page (`/review/:id`).
- Updates the spreadsheet with the `thankYouSentAt` timestamp.  
Response: `{ "success": true }`

---

## Reviews

Reviews are submitted by guests via the public review page at `/review/:id`.
Each booking tracks its own `rating` (1-5) and `review` (text).

### Get booking review status
```
GET /api/review/:id
```
(Public) Returns limited info: `guestName`, `checkIn`, `alreadyReviewed`.

### Submit review
```
POST /api/review/:id
Content-Type: application/json

{ "rating": 5, "review": "Amazing hilltop sanctuary!" }
```
(Public) Updates the spreadsheet with the rating and review text.

---

## Calendar

Useful for getting a full picture of a month — blocked dates + pending inquiries — before making decisions.

### Get calendar for a month
```
GET /api/admin/calendar?month=2026-05
Authorization: Bearer <ADMIN_API_KEY>
```
Response:
```json
{
  "month": "2026-05",
  "blocked": [
    { "start": "2026-05-01", "end": "2026-05-03", "bookingId": "uuid", "guestName": "Family Reunion" }
  ],
  "bookings": [ ...full Booking objects for the month... ],
  "inquiries": [ ...pending Inquiry objects for the month... ]
}
```
Omit `?month` to get all bookings/inquiries across all time.

---

## Availability (Public)

No auth required. Used by the public-facing calendar on yourproperty.com.

```
GET /api/availability
```
Response:
```json
{
  "blocked": [
    { "start": "2026-05-01T00:00:00.000Z", "end": "2026-05-03T00:00:00.000Z", "source": "manual" }
  ],
  "status": "unconfigured"
}
```
`status` values:
- `ok` — iCal feeds configured and synced
- `unconfigured` — no iCal URLs set (manual bookings still included)
- `error` — unexpected error (returns empty blocked array, never 500)

---

## PropertyOps Agent — Recommendation Endpoints

### Submit a recommendation (PropertyOps Agent's primary output)
```
POST /api/admin/inquiries/:row/recommend
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{
  "action": "approve",
  "reasoning": "Dates Apr 15-16 are fully available. 8 guests is within capacity. Straightforward overnight inquiry with clear contact info. Recommend confirming.",
  "notes": "Optional internal note saved to Sheet"
}
```
`action` values: `"approve"` | `"reject"` | `"escalate"`

Side effects:
- Saves recommendation to Sheet1 col M (Notes) as `[PropertyOps Agent: APPROVE] — reasoning`
- Emails owner with PropertyOps Agent's analysis, inquiry summary, and a link to the admin dashboard
- Owner logs in and clicks Approve / Reject themselves

Response:
```json
{ "success": true, "row": 2, "action": "approve", "reasoning": "..." }
```

---

### Send a message to a guest
```
POST /api/admin/guest/message
Authorization: Bearer <ADMIN_API_KEY>
Content-Type: application/json

{
  "to": "guest@example.com",
  "guestName": "Maria Santos",
  "subject": "Re: Your Property Inquiry",
  "message": "Hi Maria, we received your inquiry and are checking availability. We'll confirm within 24 hours.\n\nFeel free to reach out if you have any questions.",
  "inquiryRow": 5
}
```
- Sends a branded Your Property email to the guest via Resend
- `reply-to` is set to the owner email so guest replies go to the owner
- `message` supports newlines — each paragraph becomes a `<p>` tag
- `inquiryRow` is optional (used for logging only)

Response:
```json
{ "success": true, "messageId": "resend-message-id" }
```

---

### Webhook trigger (inbound to PropertyOps Agent)
When a guest submits the inquiry form on yourproperty.com, the site automatically POSTs to `AGENT_WEBHOOK_URL` with:
```json
{
  "event": "new_inquiry",
  "inquiry": {
    "row": 5,
    "name": "Maria Santos",
    "email": "maria@example.com",
    "phone": "+63 912 345 6789",
    "checkIn": "2026-05-01",
    "checkOut": "2026-05-03",
    "headcount": 8,
    "stayType": "overnight",
    "message": "Hi, is the pool heated?",
    "estimatedTotal": "Estimated total: ₱24,980.00 (2 nights) — soft launch pricing"
  },
  "adminApiKey": "Bearer <ADMIN_API_KEY>",
  "adminBaseUrl": "https://yourproperty.com/api/admin"
}
```
PropertyOps Agent uses the `row` to reference the inquiry in all follow-up API calls.

---

## Typical Agent Workflow (PropertyOps Agent — Recommend Mode)

**On new inquiry webhook:**
1. Receive `new_inquiry` event with inquiry data including `row`
2. `GET /api/admin/calendar?month=YYYY-MM` — check if dates are already blocked
3. Evaluate the inquiry (dates free? headcount ok? message clear?)
4. Send a holding message to guest: `POST /api/admin/guest/message` — "We received your inquiry, confirming availability shortly"
5. Submit recommendation: `POST /api/admin/inquiries/:row/recommend` with action + reasoning
6. Owner receives email, opens admin dashboard, clicks Approve or Reject

**On scheduled sweep (daily or manual):**
1. `GET /api/admin/inquiries` — check for any Pending inquiries that weren't caught by webhook
2. For each: `GET /api/admin/calendar?month=YYYY-MM` to evaluate
3. Submit recommendation for each unprocessed inquiry

**Edge cases / escalate:**
- Headcount over capacity → action: `"escalate"`, note the concern in reasoning
- Vague or incomplete message → action: `"escalate"`, optionally send guest a clarification email
- Repeat guest (same email in previous approved rows) → flag in reasoning
- Special requests (early check-in, dietary needs, etc.) → action: `"escalate"`

**Direct booking management (owner-initiated):**
- Block dates for family use: `POST /api/admin/bookings`
- Cancel a booking: `DELETE /api/admin/bookings/:id`
- These bypass the inquiry flow entirely

---

## Environment Variables Required

```
ADMIN_API_KEY=    # Bearer token (generate with: openssl rand -hex 32)
ADMIN_PASSWORD=   # Password for /admin UI login
```
