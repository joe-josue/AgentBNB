# AgentBNB

[![Status](https://img.shields.io/badge/Status-Active_Prototype-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.3.0-informational.svg)]()

AgentBNB is a white-label hospitality operations stack, shaped from what is already running at Balay Pansol.

[Stack](#the-stack) · [Templates](#white-label-templates-in-this-repo) · [Roadmap](./ROADMAP.md) · [Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) · [Support](#support)

## The Stack

### 1) System of Record (SoR)
**What it is:** markdown-first property knowledge base and operating files.

**Components**
- Property information, amenities, policies, scripts, workflows
- Image and media reference folders
- Ops docs used by owner, staff, and agent

**Why it matters**
- Serves as source of truth for website content, listing consistency, and agent answers
- Lets the agent update records as operations evolve
- Keeps owner, staff, and guest communication aligned

### 2) Website
**What it is:** stripped-down white-label version of the Balay operating site.

**Technical stack**
- Next.js + Tailwind (deployable on Vercel)
- API routes for inquiry and admin flows

**Capabilities**
- Availability/calendar checking
- Pricing estimator
- Booking inquiry form
- Admin side for inquiries, bookings, notes/briefing, and calendar
- Feedback + Google Reviews flow

### 3) Agent
**What it is:** white-label version of Gideon’s operating posture and workflow.

**Core behavior**
- Reads and maintains SoR context
- Supports website operations and updates
- Works with admin functions (inquiries, bookings, notes, calendar)
- Handles guest communication with full context
- Uses utility harnesses for decision support

**Ops surface**
- Includes sample Discord channel structure (portable to any messaging app)

### 4) Harnesses (starting with Market Pricing Harness)
**What a harness is:** a focused execution module an agent can run for one utility lane.

**Market Pricing Harness**
- Scans local market comps
- Applies seasonality/holiday context
- Produces approval-gated pricing recommendations

Repo: https://github.com/joe-josue/agentbnb-pricing-harness

## White-Label Templates in This Repo

- System of Record template: [`templates/system-of-record/`](./templates/system-of-record/)
- Website template notes: [`templates/website/`](./templates/website/)
- Agent template files (`AGENTS.md`, `SOUL.md`, channels): [`templates/agent/`](./templates/agent/)

## Status

`active-prototype`

- Stack framing is now component-first and capability-linked.
- Clean-room templates are being expanded so operators can replicate faster.
- More harnesses will be added as each capability lane is production-proven.

## Support

- If AgentBNB helped you, give it a star and share it with another property operator.
- For implementation or consulting work, contact `mail@joejosue.com`.

## License

MIT.