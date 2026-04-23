# AgentBNB — Patch Notes

Plain-English release log. Written for property owners and developers who want to follow along, not just read a commit history. Updated as the stack ships.

---

## v0.1.0 — "The Repo Goes Live" *(shipped)*

The beginning. AgentBNB moves from an internal Balay Pansol project to a public repo.

- **The stack is documented** — the full architecture is described end-to-end: guest inquiry flow, agent brain, Google Sheets source of record, Discord approval gate, and post-stay review capture. Everything in this repo is already running live.
- **Balay Pansol named as the living case study** — rather than build a demo, AgentBNB uses a real operating property as its permanent peg. What ships at Balay Pansol gets documented here.
- **Review capture flow included from day one** — the stack already handles the full post-stay arc: thank-you email, Google Review as the primary call to action, and a private feedback form for guests who prefer not to post publicly.
- **Daily checkout reminder** — a scheduled cron pings the owner in Discord on every checkout day with guest details, whether the thank-you email was sent, and direct links to the Google Review and private feedback form.

---
