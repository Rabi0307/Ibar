# IBAR — by Ibar · v3.0
### Intelligence Beyond All Reasoning · Multi-User · 13 Personas · Powered by Claude

---

## What's in v3.0
- ✅ 13 AI Personas — including NEW FinTech PM (💳)
- ✅ "Powered by Claude" shown on Boot, Home, Drawer & Doc Review
- ✅ Header kept clean — no badge clutter
- ✅ Multi-user login (email + password)
- ✅ Full conversation history — resume where you left off
- ✅ Chat · Document Review · Task System with approval flow

---

## Deploy in 8 Steps

### Step 1 — Create Free Supabase Account (Database + Login)
1. Go to: https://supabase.com → Sign up
2. Click "New project" → Name: ibar
3. Set a password → Choose your region → Create

### Step 2 — Set Up Database
1. In Supabase → click "SQL Editor" (left menu)
2. Click "New query"
3. Open the file `supabase-setup.sql` from this ZIP
4. Copy ALL text → Paste → Click Run ✅

### Step 3 — Get Supabase Keys
1. Supabase → Project Settings (gear icon) → API
2. Copy: Project URL (looks like https://xyz.supabase.co)
3. Copy: anon public key (starts with eyJ...)

### Step 4 — Get Anthropic API Key
1. Go to: https://console.anthropic.com
2. Sign up → API Keys → Create Key → Copy it

### Step 5 — Upload to GitHub
1. Go to: https://github.com → Sign up
2. New repo named: ibar
3. Upload all files from this ZIP (unzip first)

### Step 6 — Deploy on Vercel
1. Go to: https://vercel.com → Sign up with GitHub
2. Add New Project → Select ibar → Import
3. BEFORE deploying, add Environment Variables:

   | Name                          | Value                    |
   |-------------------------------|--------------------------|
   | ANTHROPIC_API_KEY             | your Anthropic key       |
   | NEXT_PUBLIC_SUPABASE_URL      | your Supabase project URL|
   | NEXT_PUBLIC_SUPABASE_ANON_KEY | your Supabase anon key   |

4. Click Deploy ✅

### Step 7 — Enable Email Auth
1. Supabase → Authentication → Providers
2. Email should already be ON by default ✅

### Step 8 — Open on Your Phone
1. Vercel gives you: https://ibar-xyz.vercel.app
2. Open in phone browser
3. Tap Share → Add to Home Screen 📱

---

## Claude Branding Locations
- 🚀 Boot screen — "Powered by Claude" badge with reactor icon
- 🏠 Home screen — Claude info card
- ☰ History drawer — Claude model details
- 📄 Doc Review — "REVIEW WITH CLAUDE" button + result badge
- 📊 Persona bar — CLAUDE SONNET indicator (subtle, below header)

Built with ❤️ by Ibar · v3.0
