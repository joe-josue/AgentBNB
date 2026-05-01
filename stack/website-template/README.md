# Website Template (White Label)

This is a full Next.js hospitality starter codebase, white-labeled from a production deployment pattern.

## Included capabilities

- Public property site sections
- Inquiry form (`/api/inquire`)
- Availability API (`/api/availability`)
- Admin login + dashboard (`/admin`)
- Admin APIs for inquiries, bookings, calendar, guest messaging
- Thank-you + review loop (`/review/[id]`)
- Checkout reminder cron route (`/api/cron/checkout-reminder`)

## Quick start

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

## Branding and data you must replace

- Property name and copy in `src/lib/config.ts`
- Domain and metadata in `src/app/layout.tsx`
- Map embed in `src/components/sections/LocationSection.tsx`
- Email sender settings in `.env.local`

## Integration docs

- API surface: `./AGENT_API.md`
- Env vars: `.env.local.example`

## Notes

- This starter is intentionally white-labeled.
- Replace placeholders before production deploy.
