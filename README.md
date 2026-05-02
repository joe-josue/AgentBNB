# AgentBNB

[![Status](https://img.shields.io/badge/Status-Replication_Starter-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.4.1-informational.svg)]()

AgentBNB is a white-label hospitality operations stack extracted from a production implementation and packaged for complete replication.

[Replication Pack](./stack/) · [Roadmap](./ROADMAP.md) · [Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) · [Support](#support)

## Stack Overview

### 1) Customized AI Agent
A specialized operations agent designed to handle the complete digital stack of your property setup.

- **Stack Management:** Capable of website maintenance, content updates, and SoR management.
- **Guest Communication:** Handles the full inquiry-to-checkout messaging flow with high context.
- **Booking Progression:** Manages inquiry triage, availability checks, and booking state transitions.
- **Advanced Ops:** Supports paid ads monitoring, caretaker briefing generation, and business record maintenance.

### 2) System of Record (SoR) Framework
A markdown-based framework for filing and maintaining the canonical knowledge of your property.

- **Property Intel:** Centralized records for amenities, features, location info, and business data.
- **Operational Assets:** Stores guest scripts, on-ground staff guides, property photos, and review history.
- **Intelligence Sync:** Keeps the owner, staff, and agent updated on live operations without data drift.
- **Agent Managed:** The agent reads from and updates these records as things develop.

### 3) White-Label Site
A deployable Next.js hospitality site that can be retrofitted (by a developer or the agent) for any property.

- **Frontend:** Beautiful single-scroll landing page designed for conversion.
- **Booking Tools:** Reservations calendar with automated price estimates.
- **Dynamic Pricing:** Integration with the agent and SoR to update rates based on site location, holidays, and seasonality.
- **Admin Dashboard:** Lean interface for reservation approvals, staff handoff notes, and calendar overview.

### 4) Harnesses
Modular "super skills" that allow the agent to execute specialized utility lanes without complicating core operations.

- **Market Pricing Harness:** Scans relevant competitors in a set radius, weights your property amenities against the compset, and recommends pricing adjustments based on market positioning.

## Traceability

The capability surface in this repo is 1:1 with working patterns from Balay Pansol operations. This stack is white-labeled and sanitized to remove property-specific identifiers while preserving the full functional architecture.

## Quick Start

1. **System of Record:** Copy `stack/system-of-record-template/` to your workspace.
2. **Website:** Clone `stack/website-template/` and update branding in `src/lib/config.ts`.
3. **Agent:** Initialize your runtime using `stack/agent-workspace-template/`.
4. **Harness:** Connect the [Market Pricing Harness](https://github.com/joe-josue/agentbnb-pricing-harness) for automated rate management.

## Support

- If AgentBNB helped you, star the repo and share it with another operator.
- For setup assistance or consulting inquiries, contact `mail@joejosue.com`.

## License

MIT.