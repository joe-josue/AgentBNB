# AgentBNB — Patch Notes

Capability-focused release history.

## v0.2.0 — Capability Sync Release (shipped)

### Added
- Live capability map in README aligned to Balay production flows.
- Explicit companion harness linkage:
  - `https://github.com/joe-josue/agentbnb-pricing-harness`

### Clarified
- Public repo scope vs private production implementation boundaries.
- Current status: active prototype with production-proven patterns and ongoing clean-room hardening.

### Capability Surface Now Documented
- Inquiry recommendation loop (`approve`, `reject`, `escalate`) with owner approval gate.
- Booking lifecycle operations (create, approve-linked create, cancel, calendar visibility).
- Guest messaging loop (holding, confirmations, declines, thank-you + review path).
- Daily checkout reminder workflow.
- Admin API-driven agent action model.

## v0.1.0 — Public Baseline (shipped)

### Added
- Initial public README, roadmap, and patch notes.
- Balay Pansol case-study framing for real-world validation.

### Documented
- Core stack: Next.js, Google Sheets, Resend, OpenClaw, Discord, Vercel cron.
