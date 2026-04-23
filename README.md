# AgentBNB

[![Status](https://img.shields.io/badge/Status-Early_Access-orange.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Version](https://img.shields.io/badge/Version-0.1.0-informational.svg)]()

**AgentBNB** is an open-source autonomous hospitality stack for independent property owners. It handles guest inquiries, automates staff briefings, and manages day-to-day property operations through an AI agent — without locking you into an expensive property management system.

> **Battle-tested at [Balay Pansol](https://balaypansol.com)** — a private hilltop retreat in Pansol, Laguna, Philippines. Everything documented here has been deployed and is running live.

---

## Why This Exists

Most hospitality software is built for humans to click buttons. AgentBNB is built for an agent to **think, recommend, and act**.

The average independent property owner juggles inquiry responses, guest communication, staff briefings, and calendar management — usually across WhatsApp threads, spreadsheets, and their own memory. AgentBNB replaces that with a persistent, autonomous operations layer that scales to one person running it alone.

---

## What It Does

### Autonomous Inquiry Triage
When a guest submits an inquiry, the agent checks your calendar, evaluates headcount and message intent, sends the guest a holding message, and posts a recommendation to your Discord with reasoning. You approve or reject in one click.

### Guest Communication
The agent drafts and sends confirmation emails, thank-you messages, and review requests. Every touchpoint is logged back to the source of record.

### Daily Operations Pings
A scheduled cron reminds you of checkouts, pending reviews, and anything that needs a human decision — surfaced in Discord so nothing slips.

### Calendar Unification
Merges iCal feeds from Airbnb, Booking.com, and manual entries into one agent-readable source of truth.

### Review Capture
Sends a post-stay thank-you with a Google Review link as the primary call to action, plus a private feedback form for guests who would rather not post publicly.

---

## The Stack

| Layer | Tool |
|-------|------|
| Frontend & Admin | Next.js 14 + Tailwind CSS, hosted on Vercel |
| Database | Google Sheets (low-cost, high-transparency source of record) |
| Transactional Email | Resend (outbound + inbound parsing) |
| AI Agent Brain | OpenClaw (the agentic infrastructure) |
| Ops Cockpit | Discord (notifications + human-in-the-loop approval gate) |
| Scheduling | Vercel Cron Jobs |

---

## Architecture

```
Guest Inquiry (form or email)
        |
        v
  Resend Inbound
        |
        v
  Agent Brain (OpenClaw / Gideon skill)
   |-- checks Google Sheets (calendar + booking history)
   |-- sends holding email to guest via Resend
   +-- posts recommendation to Discord
              |
              v
        Owner approves
              |
              v
  Confirmation email sent -> Booking written to Sheets
              |
              v
  Checkout day -> cron fires -> Discord reminder
              |
              v
  Thank-you email -> Google Review link -> private feedback form
```

---

## Case Study: Balay Pansol

AgentBNB was originally built and is actively maintained as the **"Gideon"** agent for [Balay Pansol](https://balaypansol.com), a private hilltop retreat in the Philippines. The full inquiry-to-review flow, checkout reminder, admin dashboard, and guest email templates all run live there. This repo documents the stack as a replicable pattern — property-specific details swapped for clean templates.

---

## Status

This project is in active early development. The stack is live and running at Balay Pansol. Documentation and clean-room templates are being prepared for public replication.

See [PATCH-NOTES.md](./PATCH-NOTES.md) for what has shipped and [ROADMAP.md](./ROADMAP.md) for what is coming.

---

## Getting Started

*Setup guides are coming in v0.2.0. In the meantime:*

1. **Google Sheets** — your source of record. Schema template coming soon.
2. **Resend** — outbound + inbound email. Webhook config guide coming soon.
3. **Next.js + Vercel** — the admin dashboard and API routes. Clean-room repo coming soon.
4. **OpenClaw** — the agent brain. Gideon skill export coming soon.
5. **Discord** — your cockpit. Bot setup guide coming soon.

---

## License

MIT. See `LICENSE` for details.

---

*Built on real operations. Documented for everyone.*
