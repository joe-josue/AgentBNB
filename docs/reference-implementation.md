# Reference Implementation

AgentBNB is based on the Balay Pansol production stack and Gideon, the OpenClaw-powered hospitality agent used to help operate it.

This document describes the implementation pattern without exposing private production data.

## Production Shape

Balay Pansol uses:

- a Next.js public site for property presentation and inquiries
- a Next.js admin dashboard for owner operations
- Google Sheets as the source of record for inquiries and bookings
- property system-of-record notes for rules, amenities, limitations, pricing, scripts, and operating facts
- Resend for outbound guest email and inbound guest replies
- an owner approval flow before sensitive booking decisions
- Gideon as the agent that evaluates inquiries and prepares recommendations
- caretaker handoff notes stored against booking records
- post-stay thank-you and review follow-up

## Inquiry Flow

1. Guest submits the public inquiry form.
2. The site validates name, email, and check-in date.
3. The pricing function estimates the stay total when dates are valid.
4. The site sends an owner notification and guest acknowledgement.
5. The inquiry is written to the inquiry sheet with `Pending` status.
6. Gideon is notified with the inquiry row and admin API context.
7. Gideon checks calendar context and submits a recommendation.
8. The owner approves or rejects in the admin dashboard.

## Recommendation Flow

Gideon does not silently accept bookings by default.

For each inquiry, Gideon should:

- check requested dates
- check headcount and stay type
- review guest message and special requests
- compare against property limitations and rules
- submit a recommendation of `approve`, `reject`, or `escalate`
- include reasoning the owner can inspect

The owner performs the final approval or rejection.

## Booking Flow

Approved inquiries create booking records.

Booking records:

- block dates for the public calendar
- preserve guest, stay, source, and total information
- hold caretaker handoff notes
- track thank-you email status
- store rating and review text after stay

Manual bookings can also be created to block dates for owner, family, or offline use.

## Property System Of Record

The property SoR keeps the agent honest. In the Balay Pansol implementation, the SoR includes:

- guest support policies
- property layout and sleeping setup
- bathroom, kitchen, dining, outdoor, and leisure facts
- location positioning
- listing status flags such as unavailable amenities or repairs
- pricing packages and dynamic pricing rules
- daytrip rules and rates
- open data that still needs owner confirmation

The generalized template lives at [`templates/system-of-record.md`](../templates/system-of-record.md).

## Caretaker Handoff Flow

The handoff note is a staff-facing operational surface, not just internal metadata.

The admin dashboard creates a default handoff from booking fields:

- guest name
- date range
- stay type
- headcount
- guest contact
- source
- quoted total
- guest preferences or requests
- arrival briefing
- procurement notes
- during-stay reminders

The owner or agent can update the note. The dashboard keeps it easy to save and copy for staff chat.

## Review Follow-Up

After checkout, the system can send a thank-you email and review request.

The booking record stores:

- whether the thank-you was sent
- rating
- review text

This closes the loop from inquiry to stay to post-stay feedback.

## Extraction Rule

AgentBNB should extract from the working Balay Pansol pattern.

Do:

- generalize field names and templates
- preserve the approval-gated operating model
- keep data contracts explicit
- document assumptions and safety boundaries

Do not:

- publish private guest or booking data
- hardcode Balay Pansol property details into reusable templates
- add speculative modules that are not tied to a real workflow
- imply the OSS starter is fully production-ready before the clean-room app exists
