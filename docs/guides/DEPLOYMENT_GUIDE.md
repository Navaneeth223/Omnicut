# 🚀 OmniCut Deployment Guide

Complete guide for deploying OmniCut to various hosting platforms.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] `npm run build` completes without errors
- [ ] All environment variables are documented in `.env.example`
- [ ] No hardcoded `localhost` URLs in production code
- [ ] All API keys use `import.meta.env.VITE_*` pattern
- [ ] Service worker and manifest files are in `/public`
- [ ] `vercel.json` or `netlify.toml` is configured
- [ ] COEP/COOP headers are set (required for SharedArrayBuffer)

---

## 🥇 Option 1: Vercel (Recommended)

**Why Vercel?**
- ✅ Fastest deployment (< 2 minutes)
- ✅ Automatic deploys from GitHub
- ✅ Global CDN (300+ edge locations)
- ✅ Free SSL certificate
- ✅ Custom domain support (free)
- ✅ Zero configuration for Vite
- ✅ Free forever for open-source

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub (free)

3. **Import Project**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel auto-detects Vite configuration

4. **Configure Build Settings** (if needed)
   - Framework Preset: `Vite`
   - Build Command: `pnpm build`
   - Output Directory: `apps/web/dist`
   - Install Command: `pnpm install`

5. **Deploy**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your site is live! 🎉

6. **Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your domain
   - Point DNS: `CNAME` → `cname.vercel-dns.com`

### Environment Variables:

In Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-api.com
VITE_HF_TOKEN=your_huggingface_token
```

### Auto-Deploy:

Every `git push` to `main` automatically deploys! 🚀

---

## 🌐 Option 2: Netlify

**Why Netlify?**
- ✅ Excellent for static sites
- ✅ Drag-and-drop deploy
- ✅ Free SSL certificate
- ✅ Custom domain support
- ✅ 100GB bandwidth/month free

### Method A: Drag & Drop (Easiest)

1. **Build Locally**
   ```bash
   pnpm build
   ```

2. **Deploy**
   - Go to [netlify.com](https://netlify.com)
   - Sign up (free)
   - Drag `apps/web/dist` folder to Netlify drop zone
   - Instantly live! 🎉

### Method B: GitHub Auto-Deploy

1. **Connect GitHub**
   - Netlify Dashboard → "Add new site"
   - "Import from Git" → Select repository

2. **Configure Build**
   - Build command: `pnpm build`
   - Publish directory: `apps/web/dist`
   - Node version: `20`

3. **Deploy**
   - Click "Deploy site"
   - Wait ~3 minutes
   - Live! 🎉

### Custom Domain:

- Site settings → Domain management
- Add custom domain (free)

---

## ☁️ Option 3: Cloudflare Pages

**Why Cloudflare?**
- ✅ Fastest CDN globally (300+ locations)
- ✅ Unlimited bandwidth (free)
- ✅ Unlimited sites (free)
- ✅ Best performance

### Steps:

1. **Connect GitHub**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Workers & Pages → Create application → Pages
   - Connect GitHub → Select repository

2. **Build Settings**
   - Build command: `pnpm build`
   - Build output: `apps/web/dist`
   - Node.js version: `20`

3. **Deploy**
   - Click "Save and Deploy"
   - Wait ~2 minutes
   - Live! 🎉

### Custom Domain:

- Free with Cloudflare nameservers
- Automatic SSL

---

## 📦 Option 4: GitHub Pages

**Why GitHub Pages?**
- ✅ Free forever
- ✅ No extra accounts needed
- ✅ Direct from GitHub

**Note:** Requires `coi-serviceworker` for SharedArrayBuffer support.

### Setup:

1. **Install COI Service Worker**
   ```bash
   pnpm add coi-serviceworker
   ```

2. **Add to `index.html`**
   ```html
   <script src="/coi-serviceworker.js"></script>
   ```

3. **Create GitHub Action**
   
   Create `.github/workflows/deploy.yml`:
   
   ```yaml
   name: Deploy to GitHub Pages
   
   on:
     push:
       branches: [main]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         
         - uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'pnpm'
         
         - run: pnpm install
         - run: pnpm build
         
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./apps/web/dist
   ```

4. **Enable GitHub Pages**
   - Repository Settings → Pages
   - Source: "GitHub Actions"

5. **Deploy**
   - Push to `main` branch
   - Action runs automatically
   - Live at: `https://yourusername.github.io/omnicut`

---

## 🚂 Option 5: Railway (With Backend)

**Use if:** You need Node.js backend for AI services.

**Free Tier:** $5 credit/month

### Steps:

1. **Sign Up**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **New Project**
   - "New Project" → "Deploy from GitHub"
   - Select repository

3. **Configure**
   - Start command: `pnpm start`
   - Build command: `pnpm build`

4. **Environment Variables**
   - Add API keys in Railway dashboard

5. **Deploy**
   - Automatic deployment
   - Live at: `https://omnicut.up.railway.app`

---

## 🎨 Option 6: Render (With Backend)

**Free Tier:** 750 hours/month (enough for 1 service)

**Note:** Free tier spins down after 15 min inactivity.

### Steps:

1. **Sign Up**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

2. **New Web Service**
   - "New" → "Web Service"
   - Connect GitHub repository

3. **Configure**
   - Build command: `pnpm install && pnpm build`
   - Start command: `pnpm start`
   - Environment: Node

4. **Deploy**
   - Click "Create Web Service"
   - Live at: `https://omnicut.onrender.com`

---

## 🔧 Environment Variables

Create `.env.example` in project root:

```env
# API Keys (optional - users can add their own)
VITE_HF_TOKEN=your_huggingface_token_here
VITE_REPLICATE_TOKEN=your_replicate_token_here
VITE_STABILITY_TOKEN=your_stability_token_here

# API URLs (if using backend)
VITE_API_URL=https://your-api.com

# Feature Flags
VITE_ENABLE_AI_IMAGE=true
VITE_ENABLE_AI_VOICE=true
VITE_ENABLE_AI_VIDEO=true
```

**Never commit `.env` file!** Add to `.gitignore`:

```gitignore
.env
.env.local
.env.production
```

---

## 🎯 Recommended Setup

For OmniCut specifically:

### Frontend → Vercel
- URL: `https://omnicut.vercel.app`
- Free, fast, easy
- Auto-deploys on push

### Backend (optional) → Railway
- URL: `https://omnicut-api.railway.app`
- For AI voice server, export server
- $5/month credit (enough for light usage)

### Environment Variables in Vercel:
```
VITE_API_URL=https://omnicut-api.railway.app
```

---

## 📊 Post-Deployment

### 1. Test Everything

- [ ] Homepage loads
- [ ] All workspaces accessible
- [ ] AI features work
- [ ] Export works
- [ ] PWA installable
- [ ] Offline mode works
- [ ] Mobile responsive

### 2. Performance Check

- Run Lighthouse audit
- Target scores:
  - Performance: > 90
  - Accessibility: 100
  - Best Practices: 100
  - SEO: > 90

### 3. Monitor

- Set up error tracking (Sentry)
- Monitor analytics (Plausible/Fathom)
- Check uptime (UptimeRobot)

---

## 🐛 Troubleshooting

### Build Fails

**Error:** `Module not found`
- **Fix:** Run `pnpm install` locally first
- Check all imports are correct

**Error:** `Out of memory`
- **Fix:** Increase Node memory:
  ```json
  "build": "NODE_OPTIONS=--max_old_space_size=4096 vite build"
  ```

### SharedArrayBuffer Not Available

**Error:** `SharedArrayBuffer is not defined`
- **Fix:** Ensure COEP/COOP headers are set
- Check `vercel.json` or `netlify.toml`
- For GitHub Pages, use `coi-serviceworker`

### 404 on Refresh

**Error:** Page not found when refreshing
- **Fix:** Ensure SPA redirect is configured
- Vercel: Check `rewrites` in `vercel.json`
- Netlify: Check `_redirects` file

### Slow Load Times

- Enable caching headers
- Use CDN (Vercel/Cloudflare)
- Optimize images
- Enable compression

---

## 🎉 Success!

Your OmniCut instance is now live! 🚀

**Next Steps:**
1. Share the link
2. Gather feedback
3. Monitor performance
4. Iterate and improve

**Need Help?**
- Open an issue on GitHub
- Check documentation
- Join Discord community

---

**Version:** 3.1.0  
**Last Updated:** May 8, 2026  
**Status:** Production Ready ✅
