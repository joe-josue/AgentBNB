# Check-in / Checkout Workflow

## Check-in
1. Booking is approved and written to the booking source of truth.
2. Guest confirmation message is sent.
3. Staff handoff note is generated from booking + inquiry context.

## During Stay
- Log any support requests in staff handoff notes.
- Update booking notes if requirements change.

## Checkout
1. Cron reminder posts to operator channel.
2. Verify checkout completion.
3. Send thank-you message.
4. Invite guest to leave Google review and private feedback form response.

## Agent Responsibility
The agent should keep this workflow moving and escalate only when human decision is required.