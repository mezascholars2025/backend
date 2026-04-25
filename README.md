# Meza Scholars — AI Calculator Setup

## What you have
- `index.html` — your calculator (goes on GitHub Pages)
- `vercel-backend/` — the AI backend (goes on Vercel)

## Step 1: Get an Anthropic API key (5 min)

1. Go to https://console.anthropic.com
2. Sign up with your Gmail
3. Go to "API Keys" and create a new key
4. **Copy the key** — you'll need it in step 2
5. Add ~$5 of credit (Settings → Billing). One submission costs about $0.01-0.02.

## Step 2: Deploy the backend to Vercel (10 min)

1. Go to https://vercel.com and sign up free with your GitHub account
2. Click "Add New" → "Project"
3. Click "Browse" and upload the `vercel-backend` folder (or drag it in)
4. **BEFORE clicking Deploy:** scroll down to "Environment Variables"
   - Name: `ANTHROPIC_API_KEY`
   - Value: paste the key from Step 1
5. Click Deploy
6. After 30 seconds, Vercel gives you a URL like `meza-scholars-api.vercel.app`
7. **Copy that URL** — you need it in step 3

## Step 3: Update the HTML (2 min)

1. Open `index.html` in a text editor (Notepad, TextEdit, or VS Code)
2. Find this line near the top of the script:
   ```
   const API_ENDPOINT = 'REPLACE_WITH_YOUR_VERCEL_URL/api/generate-plan';
   ```
3. Replace `REPLACE_WITH_YOUR_VERCEL_URL` with your Vercel URL from Step 2
   Example: `const API_ENDPOINT = 'https://meza-scholars-api.vercel.app/api/generate-plan';`
4. Save the file

## Step 4: Upload to GitHub Pages (5 min)

1. Upload `index.html` to your GitHub repo
2. Make sure GitHub Pages is enabled (Settings → Pages → main branch)
3. Visit your live URL

## You're done!

Test it once by submitting your own info. You should get:
- A real AI-generated personalized response on screen
- A lead notification email at mezascholars2025@gmail.com

## Costs

- Vercel: Free (generous free tier, you'll stay well under it)
- Formspree: Free (50 submissions/month free)
- Anthropic: ~$0.01-0.02 per submission. $5 of credit = ~250-500 leads.
