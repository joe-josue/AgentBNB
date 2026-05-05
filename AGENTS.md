# AgentBNB Agent Guide

AgentBNB is the public OSS publication of the hospitality operations stack extracted from the Balay Pansol and Gideon workflow. Keep the repo useful to property owners and developers who want to replicate the pattern, not as a speculative SaaS pitch.

## Project Roots

- OSS repo: `/Users/joejosue/AhensyaHQ/projects/AgentBNB`
- Website mirror: `/Users/joejosue/AhensyaHQ/projects/AgentBNB Landing Site`
- Public repo: `https://github.com/joe-josue/AgentBNB`

## Release Workflow

- Public versioning starts at `v0.1.0` on `2026-05-04`, the first public announcement release.
- Do not backdate older local commits or previous internal docs work into `v0.2.0`, `v0.3.0`, or `v0.4.2`.
- Treat every future live push as an intentional release event. Consolidate local work first, then brief Joe before any live push or merge.
- The pre-release brief must include the proposed version, release nickname/title, why the bump weight is appropriate, what is shipped, what is not shipped, and verification results.
- Only ship live after Joe has explicitly approved the release brief.
- Version numbers can jump when the weight warrants it, but do not casually bump versions for unreviewed work.
- Every release must update the README latest release section, `VERSION_HISTORY.md`, and `docs/version-history.json`.
- If the landing site mirrors release content, update `AgentBNB Landing Site/src/content/version-history.json` from the repo source before the site is released.

## Version Weight

- PATCH `0.1.x`: copy fixes, small documentation clarifications, minor polish that does not change the public capability story.
- MINOR `0.x.0`: new reusable capability, new setup guide, meaningful template expansion, or a substantial public-facing release package.
- MAJOR `x.0.0`: breaking architecture shift or `1.0.0` when the stack is complete enough to replicate from the public guides alone.

## Public Content Rules

- Ground copy in the OSS repo and the generalized Balay Pansol/Gideon reference pattern.
- Never publish private guest data, staff details, credentials, sheet IDs, family-specific operations, or unreleased private strategy.
- Keep release notes outcome-led. A property owner should understand what became possible without reading code.
- Preserve `stack/` as the durable launch surface unless Joe explicitly asks for a structural change.

## Git Rules

- Work on a project branch for release preparation.
- Keep commits focused and readable.
- Do not force-push or rewrite public release history unless Joe explicitly asks.
- Before push, verify the target branch, remote, and author identity.
