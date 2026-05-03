# External Services

This document lists the services AgentBNB expects and what each one does.

## OpenClaw

Use OpenClaw for the long-running hospitality agent if you want to follow the reference pattern.

Official docs:

- [OpenClaw Getting Started](https://docs.openclaw.ai/start/getting-started)
- [OpenClaw Channels](https://docs.openclaw.ai/channels)
- [OpenClaw Gateway Architecture](https://docs.openclaw.ai/concepts/architecture)
- [OpenClaw Tools & Plugins](https://docs.openclaw.ai/tools)

OpenClaw setup requirements from the official getting-started guide:

- Node.js, with Node 24 recommended and Node 22.14+ supported
- model provider API key
- OpenClaw Gateway
- configured channel for the owner/operator

AgentBNB recommendation:

- Run OpenClaw on an always-on local machine, home server, Mac mini, or VPS.
- Give the agent access to the property System of Record and the website repo.
- Keep owner approval required for booking decisions, refunds, damage, cancellations, rate changes, and policy exceptions.
- Fill [`stack/agent-workspace-template/TOOLS.md`](../stack/agent-workspace-template/TOOLS.md) before giving the agent external access.

## Vercel

Use Vercel for the website, admin dashboard, API routes, and cron route.

Official docs:

- [Vercel Deployments](https://vercel.com/docs/deployments)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)

AgentBNB recommendation:

- Deploy `stack/website-template` as the Next.js application.
- Store production secrets as Vercel environment variables.
- Use Vercel Cron for checkout reminders or scheduled follow-up routes.
- Do not treat Vercel as the long-running agent host. The agent should run in OpenClaw or another agent runtime.

## Resend

Use Resend for transactional email and optional inbound guest replies.

Official docs:

- [Resend Domains](https://resend.com/docs/dashboard/domains/introduction)
- [Resend Receiving Emails](https://resend.com/docs/dashboard/receiving/introduction)
- [Resend email.received webhook](https://resend.com/docs/webhooks/emails/received)

AgentBNB recommendation:

- Verify a dedicated sending domain or subdomain.
- Use a property address such as `inquiries@yourproperty.com`.
- Use a separate receiving subdomain if the owner already uses the root domain for normal email.
- Configure `email.received` webhooks only after the website API route is publicly reachable.
- Implement webhook verification before processing inbound guest replies.
- Keep the owner in the loop for refunds, cancellations, damages, complaints, and policy exceptions.

## Google Sheets

Use Google Sheets as the low-cost, transparent source of record for inquiries and bookings.

Required:

- one spreadsheet per property
- `Sheet1` tab for inquiries
- `Bookings` tab for bookings
- service account credentials
- `GOOGLE_SHEETS_ID`
- `GOOGLE_CREDENTIALS_BASE64`

Starter schemas:

- [`templates/google-sheets/inquiries.csv`](../templates/google-sheets/inquiries.csv)
- [`templates/google-sheets/bookings.csv`](../templates/google-sheets/bookings.csv)

## Owner Approval Channel

Use the channel your owner will actually check.

Good options:

- Discord
- Slack
- Telegram
- email
- admin dashboard queue

The reference pattern uses a chat-style owner cockpit for recommendations and a web admin dashboard for final actions.

## Markdown System Of Record

AgentBNB expects the property source of record to be Markdown-first.

Recommended tools:

- [Obsidian](https://obsidian.md/) for local-first vault editing
- [VS Code](https://code.visualstudio.com/) for repo-style editing
- [GitHub web editor](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files) for small remote edits
- [code-server](https://coder.com/docs/code-server) if you want a browser-based VS Code-like editor on a VPS

Recommended storage patterns:

- local folder plus Git
- Obsidian vault synced with Git or a private sync service
- VPS folder accessible through SSH, Tailscale, or a browser editor
- private repo if multiple agents or humans need controlled access

Do not put private guest records in a public repo.
