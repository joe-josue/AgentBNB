# AgentBNB — Roadmap

Capability roadmap aligned to what has actually shipped in Balay production and companion repos.

## Shipped

### v0.1.0 — Public Baseline (shipped)
- [x] Public repo with core stack narrative
- [x] Initial roadmap and patch notes
- [x] Balay Pansol case-study framing

### v0.2.0 — Capability Sync + Pricing Companion Linkage (shipped)
- [x] README aligned to live Balay capability surface
- [x] Capability-focused patch notes structure
- [x] Explicit linkage to market pricing companion harness:
  - `https://github.com/joe-josue/agentbnb-pricing-harness`

## Next

### v0.3.0 — Clean-Room Setup Docs
- [ ] Google Sheets schema template (Inquiries + Bookings)
- [ ] Resend inbound + outbound setup guide
- [ ] Admin API auth/env reference
- [ ] Cron setup guide for checkout reminders

### v0.4.0 — Public Admin Template
- [ ] Clean-room Next.js admin dashboard template
- [ ] Inquiry and booking management flows as reusable modules
- [ ] One-command deploy path to Vercel

### v0.5.0 — Agent Workflow Template
- [ ] Public OpenClaw skill template for recommendation loop
- [ ] Recommend/approve/reject/escalate flow guide
- [ ] Staff handoff / notes update pattern

### v0.6.0 — Calendar and OTA Interop
- [ ] iCal aggregation reference (Airbnb + Booking.com + manual blocks)
- [ ] Calendar reconciliation pattern to Sheet source of record

### v1.0.0 — First Full Replication
- [ ] New operator can deploy full stack end-to-end from docs/templates
- [ ] Validation pass with at least one non-Balay test property
- [ ] Final case-study package (architecture + outcomes + caveats)

Roadmap remains implementation-first: features are marked shipped only when proven in production or companion harnesses.
