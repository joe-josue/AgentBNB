# AgentBNB Stack (Replicable)

This folder contains copy-ready, white-label stack components.

If you are setting up a real property, start with [`../BOOTSTRAP.md`](../BOOTSTRAP.md).

## Components

1. `system-of-record-template/`
   - Markdown-first property knowledge base and operations records.

2. `website-template/`
   - Full Next.js codebase template (white-labeled from a production implementation).
   - Includes inquiry flow, admin APIs, booking and review loop.

3. `agent-workspace-template/`
   - Full OpenClaw-style hospitality agent workspace skeleton.
   - Includes AGENTS/SOUL/USER/TOOLS/MEMORY/HEARTBEAT and channel/runbook templates.

4. Harness companion
   - Market pricing harness repo:
   - https://github.com/joe-josue/agentbnb-pricing-harness

## Intent

This is not conceptual scaffolding. It is a replication starter pack so an operator or agent can fork, rename, configure, and run.

## Setup Order

1. Fill the System of Record.
2. Prepare media assets.
3. Configure the website template.
4. Configure Google Sheets and Resend.
5. Deploy website/admin/API/cron to Vercel.
6. Configure the agent workspace.
7. Connect the owner approval channel.
8. Run the end-to-end test checklist in [`../BOOTSTRAP.md`](../BOOTSTRAP.md).
