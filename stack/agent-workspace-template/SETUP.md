# Agent Workspace Setup

Use this when initializing the OpenClaw-style hospitality agent workspace for a new property.

## 1. Install OpenClaw

Follow the official guide:

- [OpenClaw Getting Started](https://docs.openclaw.ai/start/getting-started)

At minimum, prepare:

- Node.js
- model provider API key
- OpenClaw Gateway
- owner messaging channel

## 2. Copy The Workspace

```bash
cp -R stack/agent-workspace-template my-property-agent
cd my-property-agent
```

## 3. Fill The Core Files

Edit in this order:

1. `IDENTITY.md`
2. `USER.md`
3. `TOOLS.md`
4. `SOUL.md`
5. `AGENTS.md`
6. runbooks in `runbooks/`
7. channel notes in `channels/`

## 4. Fill TOOLS.md

Required entries:

- website repo path
- website deploy command
- System of Record path
- media path
- owner messaging app
- email provider
- admin API base URL
- Google Sheets location
- pricing harness repo, if used

Do not leave these blank before giving the agent operational tasks.

## 5. Connect Owner Channel

Pick one channel where the owner will approve recommendations.

Options:

- Discord
- Slack
- Telegram
- email
- admin dashboard queue

The agent should know:

- where to post recommendations
- which actions need owner approval
- how urgent issues should be escalated
- when not to message guests directly

## 6. Mount Or Point To The SoR

The agent must be able to read:

- property overview
- amenities
- house rules
- inquiry scripts
- check-in and checkout workflow
- staff handoff template
- media checklist
- changelog

The agent may write only where the owner allows it.

## 7. Test The Recommendation Loop

Use a fake inquiry.

The agent should:

1. read the inquiry
2. check property facts
3. check rules and limitations
4. recommend approve/reject/escalate
5. draft a guest message
6. ask for owner approval before booking confirmation

Do not connect live guest sending until this works.

## 8. Test Guest Update Handling

Use a fake guest update such as:

```text
We will arrive around 10pm and are bringing one small dog. Is that okay?
```

The agent should:

- identify the booking or inquiry
- flag policy implications
- update or propose a caretaker handoff note
- escalate if the pet policy or late arrival policy is unclear

## 9. Launch Boundary

Before launch, confirm:

- owner approval rules are explicit
- guest email sending is tested
- admin API auth is configured
- agent cannot access secrets it does not need
- SoR open questions are visible
- unresolved facts cause escalation, not guesses
