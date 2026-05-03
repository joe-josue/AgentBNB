# Deployment Options

AgentBNB has two runtime surfaces:

1. the website/admin/API surface
2. the long-running agent and System of Record surface

Do not confuse them.

## Recommended Split

Use Vercel for:

- public website
- admin dashboard
- API routes
- cron routes

Use OpenClaw or another agent runtime for:

- agent memory
- owner chat channel
- SoR maintenance
- inquiry recommendation loop
- staff handoff updates
- pricing/harness work

Use Markdown storage for:

- property facts
- operations scripts
- listing copy
- staff workflows
- change history
- media references

## Option A - Local Machine With Remote Access

Good for:

- owner-builders
- early pilots
- low-cost setups
- people already comfortable with local machines

Pattern:

- website runs on Vercel
- OpenClaw runs on a local machine
- Markdown SoR lives in a local folder or Obsidian vault
- remote access is provided by Tailscale, Cloudflare Tunnel, SSH, or a remote desktop tool

Pros:

- low monthly cost
- easy access to local files
- works well for a single operator

Cons:

- uptime depends on the device
- local networking can be fragile
- needs backup discipline

Recommended if the property is still validating operations.

## Option B - VPS Agent Host

Good for:

- more reliable uptime
- multiple operators
- properties that need always-on automation
- agents that need stable remote access

Pattern:

- website runs on Vercel
- OpenClaw runs on a VPS
- Markdown SoR lives on the VPS or a private Git repo
- access is via SSH, code-server, Tailscale, or a secured web dashboard

Pros:

- better uptime
- easier scheduled jobs
- cleaner remote access
- less dependent on a personal laptop

Cons:

- more setup
- security responsibility
- server cost
- backup and update responsibility

Recommended once the stack is handling real guest operations.

## Option C - Hybrid Local SoR, VPS Agent

Good for:

- owners who want local Markdown control
- agents that need better uptime
- teams that use Git-backed docs

Pattern:

- website runs on Vercel
- OpenClaw runs on VPS
- SoR lives in a private Git repo or synced vault
- owner edits locally, agent pulls approved updates

Pros:

- owner keeps comfortable local workflow
- agent gets stable runtime
- Git history provides change control

Cons:

- sync conflicts need process
- private data policy must be clear
- agent write permissions need boundaries

Recommended for polished production setups.

## Markdown App Recommendations

Use the simplest tool the owner will actually maintain.

- Obsidian: best for local-first property vaults.
- VS Code: best for developers and repo-native workflows.
- GitHub web editor: good for quick public-doc edits, not ideal for private ops.
- code-server: good when the SoR and agent live on a VPS.

## Security Notes

- Keep production secrets in Vercel environment variables or secure server env files.
- Do not commit `.env.local`.
- Do not store live guest records in public docs.
- Keep owner approval required for high-risk actions.
- Back up the SoR and Google Sheets.
- Treat the agent as an operator with permissions, not as an unrestricted admin.
