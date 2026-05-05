# AgentBNB

[![Status](https://img.shields.io/badge/Status-Replication_Starter-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.2.0-informational.svg)]()

### Agent BNB is white-label hospitality operations stack for running Airbnb-like properties with an AI agent.

[Bootstrap](./BOOTSTRAP.md) | [Stack Pack](./stack/) | [Reference Implementation](./docs/reference-implementation.md) | [Data Contracts](./docs/data-contracts.md) | [Version History](./VERSION_HISTORY.md) | [Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) | [Support](#support)

<p align="center">
  <img src="./assets/icon.png" alt="AgentBNB logo" width="176" />
</p>

## Latest Release: What's in v0.2.0

`v0.2.0` is the latest AgentBNB release, shipped on `2026-05-06`.

- **Market Pricing Harness official release:** The affiliated harness now has a professionalized repo, clearer AgentBNB integration guidance, init/pulse/sync/sweep modes, owner approval gates, multi-currency support, URL and pin extraction, and deterministic tests.
- **Version history in repo and on the website:** AgentBNB now has canonical structured release data, a human-readable repo page, a dedicated website page, and an RSS feed for release updates.
- **Dedicated white-label guest pages:** The website template now includes `/faq`, `/pricechecker`, and `/reserve` so operators, guests, agents, SEO surfaces, and external integrations can link directly to the exact workflow they need.

See [`VERSION_HISTORY.md`](./VERSION_HISTORY.md) for the release history and future release discipline.

## Why

The average independent property owner juggles inquiry responses, guest communication, staff briefings, calendar management, pricing, and listing updates across fragmented threads and spreadsheets. AgentBNB packages that work into a reusable digital stack an agent can run.

AgentBNB was open-sourced from a real setup: Balay Pansol (BalayPansol.com), a family-owned vacation pool house operated like an Airbnb-style short-stay property with a 90% if it's digital stack done by an AI agent workflow. The internal agent for that property is named Gideon; in your own setup, the agent would be your own property-specific operator using built on the frameworks of BalayPansol and Gideon.

## Features

### 1. Customized AI Agent

A specialized property agent (built from OpenClaw) designed to help run the complete digital stack of a short-stay property.

![Agent recommendation flow](./assets/screenshots/agent-recommendation.jpg)

- **Guest communication:** Drafts or sends controlled guest messages via email, and Meta Apps messages.
- **Inquiry triage:** Checks requested dates, headcount, stay type, guest message, and known property constraints.
- **Booking progression:** Recommends approve, reject, or escalate while keeping the owner in the loop.
- **Staff handoff:** Maintains caretaker briefing notes from booking details and guest updates.
- **Website Development & Updates:** Codes website according to relevant updates (and virtually any need on the site)
- **[NEW] End-to-End Ads Management:** Operators end-to-end Ads on Meta Apps.

### 2. System Of Record Framework

A Markdown-first framework for filing the canonical knowledge of a property.

![AgentBNB System of Record](./assets/screenshots/agentbnb-system-of-record.png)

- **Property facts:** Amenities, features, location notes, capacity, rules, rates, and current limitations.
- **Operations records:** Guest scripts, check-in workflows, staff handoff templates, and change history.
- **Listing parity:** Keeps direct-site, Airbnb, Booking.com, and social copy aligned.
- **Agent context:** Gives the agent an inspectable source of truth instead of relying on scattered chat memory.

### 3. White-Label Site

A deployable Next.js hospitality site extracted from the Balay Pansol implementation.

![White-label direct booking site](./assets/screenshots/white-label-site.jpg)

- **Public site:** Single-scroll property page with inquiry flow and pricing estimate.
- **Admin dashboard:** Inquiry approval, booking management, calendar overview, and handoff notes.
- **Google Sheets backend:** Low-cost source of record for inquiries, bookings, reviews, and follow-up state.
- **Guest loop:** Confirmation email, thank-you email, review page, and review tracking.

### 4. Harnesses

Modular execution lanes that let the agent run specialized workflows without complicating core operations.

![AgentBNB Market Pricing Harness](./assets/screenshots/agentbnb-market-pricing-harness.png)

- **Market Pricing Harness:** Scans relevant competitors in a radius, weighs property amenities and constraints, and recommends pricing adjustments for owner review.
- **More Coming Soon:** SEO/AEO Sentry, Guest Background Check, Weather Intel, etc.

## Quick Start

Start with [`BOOTSTRAP.md`](./BOOTSTRAP.md). It is the canonical setup guide for both humans and agents.

1. **System of Record:** Copy [`stack/system-of-record-template/`](./stack/system-of-record-template/) to your property workspace.
2. **Website:** Copy [`stack/website-template/`](./stack/website-template/) and update property config, metadata, copy, and environment variables.
3. **Agent:** Initialize an OpenClaw-style workspace from [`stack/agent-workspace-template/`](./stack/agent-workspace-template/).
4. **Data contracts:** Use [`docs/data-contracts.md`](./docs/data-contracts.md) to verify inquiry, booking, recommendation, handoff, and review fields.
5. **Harness:** Connect the [Market Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) when you are ready for pricing recommendations.

## Stack

| Layer | Production Pattern |
| --- | --- |
| Public site and admin | Next.js 14, Tailwind CSS, Vercel |
| Source of record | Google Sheets plus Markdown property SoR |
| Email | Resend outbound email and inbound webhook handling |
| Agent | Property-specific agent workspace; the reference property uses Gideon on OpenClaw-style infrastructure |
| Site Admin Dashboard | Admin dashboard plus owner recommendation flow |
| Staff handoff | Editable booking notes designed for copy/paste to caretakers |
| Follow-up | Thank-you email, review page, and review status stored per booking |

## Status

`replication-starter`

Core stack starter assets are present in [`stack/`](./stack/). The intended direction is to keep extracting from the working reference implementation into reusable, property-agnostic templates.

## Support

- If AgentBNB helped you, give it a star and share it with another operator.
- If you run a property and want help implementing this stack, I’m accepting a few paid setup/advisory engagements.
- For collaboration or consulting inquiries, email `mail@joejosue.com`.

## License

MIT. See [`LICENSE`](./LICENSE).
