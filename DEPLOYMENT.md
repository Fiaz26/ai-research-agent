# AI Research Agent — Deployment Guide

This app runs on **Node.js** with a **PostgreSQL** database.  
It works on Render, Railway, Fly.io, and any Node.js-compatible host.

---

## Before you start — get your free keys

You need two things regardless of which host you choose:

### 1. Free PostgreSQL database (Neon.tech)
1. Go to [neon.tech](https://neon.tech) and sign up (free, no credit card).
2. Create a new project.
3. Copy the **Connection String** — it looks like:  
   `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

### 2. Free AI key (Google Gemini — recommended)
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Sign in with your Google account.
3. Click **Create API Key** and copy it.

> Alternatively use an **OpenAI API key** from [platform.openai.com](https://platform.openai.com) (paid, but cheap for low traffic).

---

## Option A — Render.com (easiest, truly free)

1. Push this project to a **GitHub** repository (free at github.com).
2. Go to [render.com](https://render.com) and sign up.
3. Click **New → Web Service** and connect your GitHub repo.
4. Render auto-detects `render.yaml`. Confirm the settings:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start`
   - **Plan:** Free
5. Under **Environment Variables**, add:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `SESSION_SECRET` | Any long random string |
   | `NODE_ENV` | `production` |
6. Click **Create Web Service**. Render builds and deploys automatically.
7. Your URL will be: `https://ai-research-agent.onrender.com`

> **Note:** Free Render services sleep after 15 minutes of inactivity. The first visitor after a sleep waits ~30 seconds for the app to wake up. This is normal for the free tier.

---

## Option B — Railway.app ($5 free credit/month, no sleep)

1. Push this project to a **GitHub** repository.
2. Go to [railway.app](https://railway.app) and sign up.
3. Click **New Project → Deploy from GitHub repo** and select your repo.
4. Railway detects `railway.toml` automatically.
5. Click **Variables** and add:
   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Your Neon connection string |
   | `GEMINI_API_KEY` | Your Gemini API key |
   | `SESSION_SECRET` | Any long random string |
   | `NODE_ENV` | `production` |
6. Click **Deploy**. Your URL appears in the Railway dashboard.

---

## Option C — Fly.io (free allowance, no sleep)

Fly.io requires their CLI tool. Run these commands in your terminal:

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch (first time only — updates fly.toml)
fly launch

# Set environment variables
fly secrets set DATABASE_URL="your-neon-connection-string"
fly secrets set GEMINI_API_KEY="your-gemini-key"
fly secrets set SESSION_SECRET="your-random-string"
fly secrets set NODE_ENV="production"

# Deploy
fly deploy
```

---

## Option D — Any VPS or shared Node.js host

1. Copy `.env.example` to `.env` and fill in your values.
2. Run:
```bash
npm install
npm run build
npm run start
```
3. Use a process manager like **PM2** to keep it running:
```bash
npm install -g pm2
pm2 start "npm run start" --name ai-research-agent
pm2 save
```

---

## Embed in WordPress after deploying

Once you have your live URL, paste this into a **Custom HTML block** in WordPress:

```html
<iframe
  src="https://YOUR-LIVE-URL/"
  width="100%"
  height="1400"
  style="border:0; border-radius:16px;"
  loading="lazy"
  allow="clipboard-write">
</iframe>
```

Replace `https://YOUR-LIVE-URL/` with the URL from your chosen host.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon, Supabase, etc.) |
| `GEMINI_API_KEY` | One of these | Google Gemini API key (free tier available) |
| `OPENAI_API_KEY` | One of these | OpenAI API key |
| `OPENAI_BASE_URL` | No | Custom API base URL (for Groq, Together, etc.) |
| `AI_MODEL` | No | Override AI model name |
| `SESSION_SECRET` | Yes | Random string for session security |
| `NODE_ENV` | Yes | Set to `production` on all hosts |
| `PORT` | No | Server port (default: 5000) |

---

## Database migrations

After first deployment, run the database migration to create tables:

```bash
npm run db:push
```

On Render: Go to **Shell** tab in your service and run the command there.  
On Railway: Go to **Settings → Start Command** temporarily, or use the Railway CLI.  
On Fly: `fly ssh console -C "npm run db:push"`
