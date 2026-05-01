# AI Research Agent — Deployment Guide

This app runs on **Node.js** with a **PostgreSQL** database.
Works on Glitch, Render, Railway, Fly.io, and any Node.js host.

---

## Before you start — get your two free keys

### 1. Free PostgreSQL database (Neon.tech) — no card needed
1. Go to **neon.tech** → sign up free (email only, no card).
2. Click **Create Project**, give it any name.
3. Go to **Dashboard → Connection Details** and copy the connection string:
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Save it — you'll paste it as `DATABASE_URL` on your chosen host.

### 2. Free AI key (Google Gemini) — no card needed
1. Go to **aistudio.google.com/app/apikey** (sign in with Google).
2. Click **Create API Key** and copy it.
3. Save it — you'll paste it as `GEMINI_API_KEY` on your chosen host.

---

## OPTION 1 — Glitch.com (Free, No Credit Card, Easiest)

### Step 1 — Sign up
- Go to **glitch.com** → click **Sign In** → sign in with your **GitHub** account.

### Step 2 — Import your repo
- Click **New Project** (top right) → **Import from GitHub**.
- Enter: `Fiaz26/ai-research-agent`
- Click **OK**. Glitch copies all your files.

### Step 3 — Change the start script (one line, 30 seconds)
- In the Glitch file editor (left panel), click on **`package.json`**.
- Find this line:
  ```json
  "start": "NODE_ENV=production node dist/index.cjs",
  ```
- Change it to:
  ```json
  "start": "node glitch-start.js",
  ```
- Glitch saves automatically.
- This tells Glitch to use the included `glitch-start.js` which auto-builds the
  app on first launch, then starts the server. You never need to run a build command manually.

### Step 4 — Add environment variables
- In the Glitch left panel, click the **`.env`** file (Glitch keeps this private).
- Add these lines (replace the values with your own):
  ```
  DATABASE_URL=postgresql://user:password@host/dbname
  GEMINI_API_KEY=your-gemini-api-key
  SESSION_SECRET=any-long-random-string-like-this-abc123xyz
  NODE_ENV=production
  ```

### Step 5 — Run database setup (one time only)
- At the bottom of the Glitch screen, click **Terminal**.
- Type this and press Enter:
  ```
  npm run db:push
  ```
- You should see: `Changes applied ✓`

### Step 6 — Get your live URL
- Click the **Share** button (top left) → copy the Live Site URL.
- It looks like: `https://ai-research-agent.glitch.me`
- Paste it into your WordPress iframe embed code.

### Important Glitch notes
- The app sleeps after **5 minutes** of no visitors. The next visitor wakes it in ~20 seconds.
- First launch takes **1–2 minutes** while the auto-build runs. After that, it's instant.
- If you change any code, click the **Refresh** button in Glitch terminal to rebuild.

---

## OPTION 2 — Adaptable.io (Free, No Credit Card)

1. Go to **adaptable.io** → sign up with your GitHub account.
2. Click **New App** → **Connect to GitHub** → select `Fiaz26/ai-research-agent`.
3. Choose **Node.js** as the app type.
4. Set:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm run start`
5. Add environment variables:
   - `DATABASE_URL` → your Neon connection string
   - `GEMINI_API_KEY` → your Gemini key
   - `SESSION_SECRET` → any long random string
   - `NODE_ENV` → `production`
6. Click **Deploy**. Your URL appears in the dashboard.

---

## OPTION 3 — Railway.app ($5 free credit/month, never sleeps)

1. Go to **railway.app** → sign up with GitHub.
2. Click **New Project** → **Deploy from GitHub repo** → select `Fiaz26/ai-research-agent`.
3. Railway auto-detects `railway.toml` — no settings needed.
4. Click **Variables** tab and add:
   - `DATABASE_URL`, `GEMINI_API_KEY`, `SESSION_SECRET`, `NODE_ENV=production`
5. Click **Deploy**.

---

## OPTION 4 — Render.com (Free, Requires Card for Verification)

1. Go to **render.com** → sign up.
2. Click **New + → Web Service** → connect your GitHub repo.
3. Render auto-detects `render.yaml`. Confirm settings and click **Create Web Service**.
4. Add environment variables in the **Environment** tab.
5. After deploy, open the **Shell** tab and run: `npm run db:push`

---

## WordPress Embed Code

After deploying on any platform, paste this into a **Custom HTML block** in WordPress.
Replace `YOUR-LIVE-URL` with your actual deployed URL:

```html
<div style="max-width:1200px; margin:0 auto;">
  <iframe
    src="https://YOUR-LIVE-URL/"
    title="AI Research Agent"
    width="100%"
    height="1400"
    style="border:0; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.15); display:block;"
    loading="lazy"
    allow="clipboard-write">
  </iframe>
</div>
```

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon.tech PostgreSQL connection string |
| `GEMINI_API_KEY` | Yes (or use OPENAI_API_KEY) | Google Gemini free AI key |
| `OPENAI_API_KEY` | Alternative to Gemini | OpenAI paid API key |
| `SESSION_SECRET` | Yes | Any long random string for security |
| `NODE_ENV` | Yes | Must be set to `production` |
| `AI_MODEL` | No | Override model (default: gemini-2.0-flash) |
| `PORT` | No | Server port (default: 5000) |
