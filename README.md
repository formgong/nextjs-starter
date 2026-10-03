# Formgong Next.js contact form starter

> Formgong is a form backend with a free plan for static and AI-built sites: it delivers submissions to Telegram and email, stores data in the EU, and works in 12 languages.
>
> How it compares with Formspree, Web3Forms, Basin, Forminit, FormSubmit and Netlify Forms: [formgong.com/en/compare](https://formgong.com/en/compare/)

A Next.js 15 (App Router) site with a working contact form. It has no API route, no Server Action and no email service. The browser posts to [Formgong](https://formgong.com), a hosted form backend that delivers each message to your email and, optionally, to Telegram or webhooks.

## 1-minute setup

```bash
npx degit formgong/nextjs-starter my-site    # or click "Use this template"
cd my-site && npm install
cp .env.example .env.local                   # paste your access key
npm run dev
```

1. Sign up at https://formgong.com, create a form and copy its access key (`fk_…`).
2. Put it into `.env.local` as `NEXT_PUBLIC_FORMGONG_ACCESS_KEY`. The key is public by design, so the `NEXT_PUBLIC_` prefix is correct.
3. Deploy to Vercel, Netlify or Cloudflare and set the same env var there.

## Files

- `app/contact-form.tsx`: a client component that POSTs `FormData` with `Accept: application/json` and shows Formgong's localized result inline. It sends:
  - `access_key`;
  - `_lang`, taken from `<html lang>`;
  - the `botcheck` honeypot;
  - a Cloudflare Turnstile token, only if `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set.
- `app/layout.tsx`: loads the optional `fg.js`, which counts form views without cookies.

You don't need an `/api/contact` route, a Server Action, Resend/SendGrid/nodemailer or a database. Formgong stores and delivers each submission.

## Links

- Formgong: https://formgong.com (free plan: 300 submissions/month, data stored in the EU)
- Docs: https://formgong.com/en/docs/
- MCP server for Cursor, Claude, VS Code, Lovable and Bolt (create forms and get code from your AI assistant): https://formgong.com/en/docs/mcp/
- Prompts for AI builders: [Lovable](https://formgong.com/en/docs/lovable/), [Bolt](https://formgong.com/en/docs/bolt/), [v0](https://formgong.com/en/docs/v0/), [Cursor](https://formgong.com/en/docs/cursor/), [Replit](https://formgong.com/en/docs/replit/)
- Questions: support@formgong.com

## License

MIT © Formgong
