# AgentBNB Bootstrap Guide

Read this first if you are a human operator or an agent setting up AgentBNB for a new property.

AgentBNB is not a one-command installer yet. It is a white-label stack extracted from a working hospitality setup. Your job during bootstrap is to collect the property facts, prepare the source of record, configure services, then wire the website and agent together.

## Agent Bootstrap Rule

If you are an agent:

1. Read this file.
2. Read [`stack/README.md`](./stack/README.md).
3. Read [`docs/external-services.md`](./docs/external-services.md).
4. Read [`docs/deployment-options.md`](./docs/deployment-options.md).
5. Audit what inputs are missing.
6. Return a checklist to the owner before building.
7. Do not invent property facts, rates, rules, or guest-facing promises.

## Build Order

1. Collect property inputs.
2. Fill the System of Record.
3. Prepare media assets.
4. Configure Google Sheets.
5. Configure Resend email.
6. Configure the website template.
7. Deploy website/admin/API to Vercel.
8. Configure the OpenClaw-style agent workspace.
9. Connect owner approval channel.
10. Run end-to-end tests.

## Required Owner Inputs

Collect these before implementation:

- property name
- public domain or desired domain
- location and Google Maps link
- short positioning statement
- ideal guests and poor-fit guests
- maximum overnight guests
- maximum day guests
- bedrooms, beds, bathrooms
- amenities and limitations
- house rules
- check-in and check-out policy
- pricing rules
- daytrip vs overnight rules, if applicable
- owner email and guest support email
- caretaker or staff handoff process
- cancellation/refund policy
- OTA links, if any
- Airbnb and Booking.com iCal URLs, if available
- property photos and videos
- logo or brand assets, if any

## Required Services

Minimum stack:

- GitHub repo or local project folder
- Google account for Sheets
- Vercel account for website/admin/API/cron
- Resend account for transactional email and inbound guest replies
- OpenClaw or another agent runtime
- owner approval channel such as Discord, Slack, Telegram, email, or an admin queue
- Markdown editor or Markdown vault for the System of Record

Recommended reading:

- [`docs/external-services.md`](./docs/external-services.md)
- [`docs/deployment-options.md`](./docs/deployment-options.md)

## Step 1 - Fill The System Of Record

Copy:

```bash
cp -R stack/system-of-record-template my-property-sor
```

Fill these first:

- `property-profile/property-overview.md`
- `property-profile/amenities.md`
- `property-profile/house-rules.md`
- `operations/inquiry-scripts.md`
- `operations/checkin-checkout-workflow.md`
- `operations/staff-handoff-template.md`
- `media/README.md`

The SoR is the agent's operating truth. If it is vague, the agent will be vague.

## Step 2 - Prepare Media

Use [`stack/system-of-record-template/media/README.md`](./stack/system-of-record-template/media/README.md) as the checklist.

At minimum, gather:

- hero photo
- exterior photo
- main amenity photo
- sleeping area photos
- kitchen/dining photos
- bathroom photos
- location/access photos if useful
- brand/logo assets if available

## Step 3 - Prepare Google Sheets

Create a Google Sheet with:

- `Sheet1` for inquiries
- `Bookings` for accepted stays and manual blocks

Use:

- [`templates/google-sheets/inquiries.csv`](./templates/google-sheets/inquiries.csv)
- [`templates/google-sheets/bookings.csv`](./templates/google-sheets/bookings.csv)

Then create a Google service account and prepare:

- `GOOGLE_SHEETS_ID`
- `GOOGLE_CREDENTIALS_BASE64`

## Step 4 - Configure Resend

Use Resend for:

- guest inquiry acknowledgement
- owner notification
- approval/decline emails
- thank-you and review follow-up
- inbound guest replies, if enabled

Recommended:

- use a dedicated sending domain or subdomain
- use a guest-facing address such as `inquiries@yourproperty.com`
- use inbound receiving on a subdomain if you already use the root domain for normal email
- verify inbound webhooks before relying on them for guest operations

See [`docs/external-services.md`](./docs/external-services.md).

## Step 5 - Configure The Website Template

Copy:

```bash
cp -R stack/website-template my-property-site
cd my-property-site
npm install
cp .env.local.example .env.local
npm run dev
```

Replace:

- property config in `src/lib/config.ts`
- metadata in `src/app/layout.tsx`
- map embed in `src/components/sections/LocationSection.tsx`
- gallery/media assets
- email sender settings
- Google Sheets and Resend env vars

## Step 6 - Configure Vercel

Deploy the website/admin/API/cron to Vercel.

Vercel hosts:

- public website
- admin dashboard
- API routes
- checkout reminder cron

Vercel does not run the long-lived property agent. Run the agent locally or on a VPS.

## Step 7 - Configure Agent Workspace

Copy:

```bash
cp -R stack/agent-workspace-template my-property-agent
```

Then follow:

- [`stack/agent-workspace-template/SETUP.md`](./stack/agent-workspace-template/SETUP.md)

Fill:

- `IDENTITY.md`
- `USER.md`
- `TOOLS.md`
- `SOUL.md`
- runbooks
- owner approval channel

## Step 8 - Run End-To-End Tests

Before launch, verify:

- public site loads
- inquiry form submits
- inquiry writes to Google Sheets
- owner receives notification
- agent can read inquiry context
- agent can recommend approve/reject/escalate
- admin can approve inquiry
- booking is created
- blocked dates update
- caretaker handoff can be saved and copied
- thank-you email can be sent
- review page works
- cron route is protected and callable

## Launch Rule

Do not launch with unknown property facts. Keep unresolved items in the SoR under open questions and make the agent escalate instead of guessing.
