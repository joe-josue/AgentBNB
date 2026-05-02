# Data Contracts

These contracts are generalized from the Balay Pansol production implementation.

## Inquiry Sheet

Tab: `Sheet1`

Headers:

```csv
Timestamp,Name,Email,Phone,Check-in,Check-out,Headcount,Stay Type,Message,Estimated Total,Status,Booking ID,Notes
```

Status values:

- `Pending`
- `Approved`
- `Rejected`

The row number is used as the inquiry identifier in the current implementation.

## Booking Sheet

Tab: `Bookings`

Headers:

```csv
Booking ID,Check-in,Check-out,Guest Name,Guest Email,Headcount,Stay Type,Total,Source,Inquiry Row,Notes,Thank You Sent,Rating,Review,Created At
```

The `Notes` column is the caretaker handoff surface. It should be written in a format that staff can understand and copy into chat.

## Public Availability

The public availability endpoint returns blocked date ranges.

```json
{
  "blocked": [
    {
      "start": "2026-05-01T00:00:00.000Z",
      "end": "2026-05-03T00:00:00.000Z",
      "source": "manual"
    }
  ],
  "status": "ok"
}
```

Expected status values:

- `ok`
- `unconfigured`
- `error`

## Agent Recommendation

Gideon's primary output is a recommendation attached to an inquiry row.

```json
{
  "action": "approve",
  "reasoning": "Dates are available, headcount is within capacity, and the request is straightforward.",
  "notes": "Optional internal note"
}
```

Action values:

- `approve`
- `reject`
- `escalate`

The recommendation is saved for owner review. The owner still approves or rejects the booking.

## Guest Message

The agent can draft or send guest messages through an authenticated admin endpoint.

```json
{
  "to": "guest@example.com",
  "guestName": "Guest Name",
  "subject": "Re: Your Property Inquiry",
  "message": "Hi Guest, we received your inquiry and are checking availability.",
  "inquiryRow": 5
}
```

Use this for controlled communication, not for hidden autonomous commitments.

## Caretaker Handoff

The handoff is stored in the booking `Notes` field.

Recommended shape:

```text
Caretaker Handoff - [Guest Name]

Booking: [Check-in] -> [Check-out]
Stay: [Day trip or Overnight]
Guests: [Headcount] pax
Guest contact: [Email or phone]
Source: [direct/manual/platform]
Quoted total: [Total]

Guest preferences / special requests:
- 

Arrival briefing for staff:
- 

During-stay notes:
- 
```

## Review Record

Review data is stored on the booking record:

- `Thank You Sent`
- `Rating`
- `Review`

The public review page should expose only limited booking information and should not leak private booking data.
