# AgentBNB

[![Status](https://img.shields.io/badge/Status-Replication_Starter-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.4.0-informational.svg)]()

AgentBNB is a white-label hospitality operations stack, extracted from a live operating system and packaged for replication.

[Stack Pack](./stack/) · [Roadmap](./ROADMAP.md) · [Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) · [Support](#support)

## What you can copy right now

This repo now includes full stack starter assets, not only docs:

- **System of Record template pack** (`stack/system-of-record-template/`)
- **Website starter codebase** (`stack/website-template/`) with inquiry/admin/review flows
- **Agent workspace starter codebase** (`stack/agent-workspace-template/`) with OpenClaw-style structure

## Stack Components

### 1) System of Record (SoR)
Canonical markdown-based knowledge base for property operations.

Includes:
- property profile, amenities, policies, scripts, workflows
- listing copy canon
- media folders
- changelog discipline

Why it matters:
- keeps website, OTA listings, and agent responses consistent
- gives agents complete context for guest support and ops updates

### 2) Website
White-label Next.js hospitality site starter.

Includes:
- public pages and inquiry flow
- availability + pricing estimation logic
- admin API and admin UX for inquiries/bookings/notes/calendar
- feedback and Google review loop

### 3) Agent Workspace
White-label hospitality agent workspace starter.

Includes:
- `AGENTS.md`, `SOUL.md`, `USER.md`, `TOOLS.md`, `MEMORY.md`, `HEARTBEAT.md`
- runbooks for inquiry and checkout loops
- sample messaging/channel topology

Designed so an agent can operate the full stack, not just chat.

### 4) Harnesses
Utility modules for focused decision/execution lanes.

Current companion harness:
- **Market Pricing Harness**: https://github.com/joe-josue/agentbnb-pricing-harness

## Traceability and source alignment

The stack structure and capability surface here is aligned to real, working patterns from Balay operations.

This repo is white-labeled and sanitized for public replication. Property-specific identifiers and private data are intentionally removed.

## Quick start

1. Copy `stack/system-of-record-template/` into your property workspace.
2. Clone `stack/website-template/` as your site starter and replace branding/config values.
3. Copy `stack/agent-workspace-template/` for your hospitality agent runtime.
4. Connect the market pricing harness when you are ready for pricing automation.

## Status

`replication-starter`

- Core stack starter assets are now present.
- More harnesses will be added as they become production-proven.

## Support

- If AgentBNB helped, star the repo and share it.
- For implementation support: `mail@joejosue.com`.

## License

MIT