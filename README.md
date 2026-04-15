# AgentBNB — The Open-Source Autonomous Hospitality Stack

**AgentBNB** is an open-source implementation of a "PropTech Sidecar" — an autonomous operations layer that sits on top of your property listings to handle inquiries, guest communication, and staff briefing.

Originally developed for **Balay sa Pansol** as the "Gideon" agent, this stack moves beyond simple auto-responders by creating a persistent **System of Record** and a **Decision Engine** for property owners.

---

## The Value Prop
Most property management software (PMS) is designed for humans to click buttons. **AgentBNB** is designed for an agent to think and act.
- **Walled Garden End-Run:** Works via inbound email parsing, bypassing the need for restricted Airbnb/Booking.com APIs.
- **Staff Briefing:** Automatically generates and updates "Caretaker Handoff" cards based on guest conversations.
- **Decision Support:** Analyzes inquiries against your calendar and recommends Approve/Reject/Escalate.

---

## The Stack

### 1. Frontend & Admin Dashboard
- **Next.js** (Hosted on Vercel)
- **Shadcn/UI** for the admin interface
- **Google Sheets** as the low-cost, high-transparency database (Sheet1: Inquiries, Sheet2: Bookings)

### 2. Communication Layer
- **Resend** (Transactional Email)
- **Inbound Webhooks:** Captures guest replies and routes them back to the agent for parsing.

### 3. Brain (The Agent)
- **OpenClaw:** The underlying agentic infrastructure.
- **Gideon Skill:** The specialized hospitality logic that handles inquiry evaluation and briefing generation.

### 4. Cockpit
- **Discord:** Real-time notifications and approval-gate for the property owner.

---

## Core Features

### 🟢 Autonomous Inquiry Triage
When an inquiry hits the site, the agent:
1. Checks calendar availability via the Unified Source of Truth.
2. Evaluates headcount, message intent, and guest history.
3. Sends a "Holding Message" to the guest.
4. Posts a Recommendation to the owner in Discord with reasoning.

### 🟢 Dynamic Guest Briefing
The agent maintains a "Living Card" for every booking.
- **Inbound Parsing:** As guests reply with arrival times or special requests, the agent updates the briefing note.
- **Staff Handoff:** Provides the caretaker with a single, updated source of truth for every guest stay.

### 🟢 Calendar Unification
Integrates iCal feeds from Airbnb, Booking.com, and manual entries into one view for the agent and owner.

---

## Setup & Implementation
*(Coming Soon)*
- [ ] Repo Initialization
- [ ] Google Sheets Schema Template
- [ ] Resend Webhook Configuration
- [ ] OpenClaw Gideon Skill Export

---
**Powered by Ahensya**
*A case study in high-context autonomous operations.*
