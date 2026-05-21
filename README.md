# Frame

Inbound chat triage that doesn't miss the buyer.

Frame drops a chat widget on your site, reads every incoming message in your brand voice, and routes the real buyers to you in seconds. Everything else gets handled. Five intents: lead, support, billing, out-of-scope, spam.

## Stack

- Vite + React 18 + TypeScript
- Tailwind 3, custom Raycast-style multi-stop gradient palette
- Supabase (auth + Postgres, RLS-enforced multi-tenant `frame` schema)
- Anthropic Claude 3.5 Sonnet for triage (with deterministic fallback)
- Resend for owner email alerts
- Vercel edge runtime for `/api/triage` and `/api/route-to-owner`

## How it works

1. Owner signs in, gets three seeded example widgets (Tampa Roofing Co, Studio Bloom Photography, Westside Auto Repair).
2. Configure brand voice and escalation rules per widget. Copy the embed snippet.
3. Visitor messages hit `/api/triage`. Claude (or deterministic fallback) returns intent + confidence + reasoning + reply.
4. High-value leads route via Resend to the owner's email; everything else gets an auto-reply in brand voice.
5. Every conversation lands in the dashboard with the triage reasoning visible.

## Triage path

The `/api/triage` edge function tries Claude first. If the Anthropic key is missing or the account is out of credits, it falls back to a deterministic engine using the same return shape (`intent`, `confidence`, `reasoning`, `suggested_reply`, `should_route_to_owner`, `visitor_summary`). The UI labels which path fired and how long it took.

When Anthropic credits are added at platform.claude.com/settings/billing, the Claude path takes over with zero code change.

## Embed snippet

Each widget exposes a one-line install:

```html
<script
  src="https://frame.app/widget.js"
  data-frame-id="YOUR_EMBED_ID"
  defer
></script>
```

The dashboard's per-widget detail page shows the exact snippet with the right embed ID.

## Database

Schema `frame` in the shared Supabase project. Three tables: `widgets`, `conversations`, `messages`. RLS policies scope every row to `auth.uid()`. Cascade deletes from widgets down.

## Local dev

```bash
npm install
npm run dev
```

Requires `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Serverless functions need `ANTHROPIC_API_KEY` and `RESEND_API_KEY` set as Vercel env vars in production.

## Deploy

Pushed automatically to Vercel on commit to `main`. Production env vars set via Vercel CLI.

