# AgentBNB

[![Status](https://img.shields.io/badge/Status-Active_Prototype-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.2.0-informational.svg)]()

Open-source hospitality operations stack for independent property owners, built around an AI agent that triages inquiries, manages booking decisions, and closes the guest loop.

[Capabilities](#capabilities-live-at-balay-pansol) · [Architecture](#architecture) · [Roadmap](./ROADMAP.md) · [Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) · [Support](#support)

> Battle-tested at [Balay Pansol](https://balaypansol.com). This repo tracks what is already working in production and maps it into public-safe patterns.

## Why

Most hospitality tools are built for humans to click through dashboards.
AgentBNB is built for an agent to evaluate, recommend, and execute with approval gates.

## Capabilities Live at Balay Pansol

### Inquiry and Decision Flow
- Guest inquiry capture from website form
- Agent recommendation actions: `approve`, `reject`, `escalate`
- Owner approval gate before final booking decision
- Recommendation reasoning logged to the source of record

### Booking Operations
- Auto-create booking when inquiry is approved
- Manual booking create/cancel endpoints for owner blocks and adjustments
- Calendar month view with blocked dates, bookings, and pending inquiries

### Guest Messaging Loop
- Holding/reply messages to guests via Resend
- Booking confirmation and decline flow
- Post-stay thank-you flow with Google Review as primary CTA
- Private feedback collection path for guests who do not post publicly

### Agent + Ops Integration
- OpenClaw agent webhook trigger on new inquiry
- Daily checkout reminder cron to Discord
- Admin API for agent-safe actions (inquiries, bookings, calendar, guest messaging)

### Market Pricing Companion (Available Now)
- Companion repo: [agentbnb-pricing-harness](https://github.com/joe-josue/agentbnb-pricing-harness)
- Includes market comps scan, location-aware holidays/seasonality, persona-based pricing, and approval-gated config patching

## Stack

| Layer | Tool |
|---|---|
| Frontend & Admin | Next.js + Tailwind CSS (Vercel) |
| Source of Record | Google Sheets |
| Email | Resend (outbound + inbound handling) |
| Agent Runtime | OpenClaw |
| Human Approval Cockpit | Discord |
| Scheduling | Vercel Cron |

## Architecture

```text
Guest Inquiry
   -> Site API / Inbound Email
   -> Agent (OpenClaw)
      -> Checks Calendar + Inquiry Context
      -> Sends Holding Message
      -> Submits Recommendation (approve/reject/escalate)
   -> Owner Approves/Rejects
   -> Booking + Calendar Update
   -> Checkout Cron Reminder
   -> Thank-you + Review / Feedback Loop
```

## Repository Scope

This repo is the public-facing stack narrative and roadmap.
Implementation components in active use are split across companion repos to keep boundaries clean:

- Balay production implementation (private): `joe-josue/Balay-Pansol`
- Market pricing layer (public): `joe-josue/agentbnb-pricing-harness`

## Status

`active-prototype`

- Production capabilities are live at Balay Pansol.
- Public clean-room templates are still being hardened for plug-and-play replication.
- See [PATCH-NOTES.md](./PATCH-NOTES.md) for shipped capability updates.

## Quick Start (Current)

1. Read this repo for architecture and capability mapping.
2. Use the companion [agentbnb-pricing-harness](https://github.com/joe-josue/agentbnb-pricing-harness) for market pricing workflows now.
3. Follow [ROADMAP.md](./ROADMAP.md) for clean-room implementation template milestones.

## Support

- If AgentBNB helped you, give it a star and share it with someone running a property.
- For implementation or consulting work, contact `mail@joejosue.com`.

## License

MIT.
