# AgentBNB Version History

AgentBNB ships in intentional public versions. Public versioning starts at `v0.1.0` on `2026-05-04`, the first public announcement release.

Older local commits and private shaping work are not retroactively assigned public version numbers. Future live pushes should happen only after the release has been consolidated, briefed, and approved.

## Latest Release: What's in v0.2.0

**Release date:** 2026-05-06  
**Key items:** Pricing Harness, Versions, Dedicated Pages  
**Status:** Shipped

This release rounds out AgentBNB's public operating surface with the official pricing harness, clean release history, and dedicated white-label guest pages.

- **Market Pricing Harness official release:** The affiliated harness now has a professionalized repo, clearer AgentBNB integration guidance, init/pulse/sync/sweep modes, owner approval gates, multi-currency support, URL and pin extraction, and deterministic tests.
- **Version history in repo and on the website:** AgentBNB now has canonical structured release data, this human-readable repo page, a dedicated website page, and an RSS feed for release updates.
- **Dedicated white-label guest pages:** The website template now includes `/faq`, `/pricechecker`, and `/reserve` so operators, guests, agents, SEO surfaces, and external integrations can link directly to the exact workflow they need.

## Previous Release: What's in v0.1.0

**Release date:** 2026-05-04  
**Key items:** AI Agent, SoR, Website, Harnesses  
**Status:** Shipped

The first public AgentBNB release ships the launch feature set for AI-assisted short-stay property operations.

- **Customized AI hospitality agent:** Inquiry triage, guest messaging, owner recommendations, booking progression, staff handoff notes, website updates, and ads-management support.
- **Property system of record:** Markdown-first framework for property facts, operating records, listing parity, and agent context.
- **White-label site and admin stack:** Direct inquiry flow, approval dashboard, Google Sheets backend, confirmation email, thank-you email, review page, and review tracking.
- **Harness lane:** Market-pricing recommendations compare nearby competitors, weigh property constraints, and prepare owner-reviewed price updates.
- **Launch support surface:** Public docs, feature visuals, setup path, and support CTA make the launch stack understandable for operators and forkable for developers.

## Release Discipline

Before any future live push or merge, prepare a brief with:

- Proposed version and release title.
- Why the bump is a patch, minor, major, or intentional jump.
- What is shipped.
- What is not shipped.
- Verification results.
- Any mirrored website updates required for `agent-bnb.com`.

After approval, update this file, `docs/version-history.json`, and the README latest release section before shipping.
