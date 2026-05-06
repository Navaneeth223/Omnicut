# 🚀 OmniCut Deployment Guide

Complete guide for deploying OmniCut to production.

---

## 📋 Prerequisites

- Node.js 20+
- pnpm 8+
- Git
- Domain name (optional)
- Hosting account (Vercel, Netlify, or similar)

---

## 🌐 Web App Deployment

### **Option 1: Vercel (Recommended)**

#### **1. Install Vercel CLI**
```bash
npm install -g vercel
```

#### **2. Build the App**
```bash
cd apps/web
pnpm build
```

#### **3. Deploy**
```bash
vercel
```

#### **4. Configure**
- **Framework Preset:** Vite
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

#### **5. Environment Variables**
None required for basic deployment.

#### **6. Custom Domain**
```bash
vercel domains add omnicut.app
```

---

### **Option 2: Netlify**

#### **1. Build the App**
```bash
cd apps/web
pnpm build
```

#### **2. Deploy via CLI**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### **3. Or Deploy via Git**
1. Push to GitHub
2. Connect repository in Netlify
3. Configure build settings:
   - **Build Command:** `cd apps/web && pnpm build`
   - **Publish Directory:** `apps/web/dist`
   - **Base Directory:** `/`

---

### **Option 3: Static Hosting**

#### **1. Build**
```bash
cd apps/web
pnpm build
```

#### **2. Upload**
Upload `dist/` folder to:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- GitHub Pages
- Any static host

#### **3. Configure**
- Enable SPA routing (redirect all to `index.html`)
- Set cache headers for assets
- Enable HTTPS

---

## 🖥️ Desktop App Deployment

### **Build for All Platforms**

#### **1. Install Dependencies**
```bash
cd apps/desktop
pnpm install
```

#### **2. Build**
```bash
# macOS
pnpm build:mac

# Windows
pnpm build:win

# Linux
pnpm build:linux

# All platforms
pnpm build:all
```

#### **3. Output**
Built apps in `apps/desktop/dist/`:
- **macOS:** `.dmg` and `.app`
- **Windows:** `.exe` and `.msi`
- **Linux:** `.AppImage`, `.deb`, `.rpm`

---

### **Code Signing**

#### **macOS**
```bash
# Get certificate from Apple Developer
# Set environment variables
export APPLE_ID="your@email.com"
export APPLE_ID_PASSWORD="app-specific-password"
export CSC_LINK="path/to/certificate.p12"
export CSC_KEY_PASSWORD="certificate-password"

# Build with signing
pnpm build:mac
```

#### **Windows**
```bash
# Get certificate from CA
export CSC_LINK="path/to/certificate.pfx"
export CSC_KEY_PASSWORD="certificate-password"

# Build with signing
pnpm build:win
```

---

### **Auto-Update Setup**

#### **1. Configure Update Server**
```typescript
// apps/desktop/src/main.ts
import { autoUpdater } from 'electron-updater';

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'omnicut',
  repo: 'omnicut',
});

autoUpdater.checkForUpdatesAndNotify();
```

#### **2. Publish Releases**
```bash
# Tag version
git tag v1.0.0
git push --tags

# GitHub Actions will build and publish
```

---

## 📱 Mobile App Deployment

### **iOS App Store**

#### **1. Build**
```bash
cd apps/mobile
pnpm build:ios
```

#### **2. Open in Xcode**
```bash
npx cap open ios
```

#### **3. Configure**
- Set bundle ID
- Add app icons
- Configure capabilities
- Set version and build number

#### **4. Archive**
- Product → Archive
- Distribute App
- Upload to App Store Connect

#### **5. Submit**
- Fill app information
- Add screenshots
- Submit for review

---

### **Android Play Store**

#### **1. Build**
```bash
cd apps/mobile
pnpm build:android
```

#### **2. Open in Android Studio**
```bash
npx cap open android
```

#### **3. Configure**
- Set package name
- Add app icons
- Configure signing
- Set version code and name

#### **4. Generate Signed APK/AAB**
- Build → Generate Signed Bundle/APK
- Choose AAB (recommended)
- Upload to Play Console

#### **5. Submit**
- Create release
- Add release notes
- Submit for review

---

## 🔧 Configuration

### **Environment Variables**

#### **Web App**
```bash
# .env.production
VITE_APP_NAME=OmniCut
VITE_APP_VERSION=1.0.0
VITE_API_URL=https://api.omnicut.app
```

#### **Desktop App**
```bash
# .env
APP_NAME=OmniCut
APP_VERSION=1.0.0
AUTO_UPDATE_URL=https://updates.omnicut.app
```

---

### **Build Optimization**

#### **1. Analyze Bundle**
```bash
cd apps/web
pnpm build --analyze
```

#### **2. Optimize**
- Code splitting
- Tree shaking
- Minification
- Compression (gzip/brotli)
- Image optimization
- Font subsetting

#### **3. Performance**
- Lazy loading
- Preloading
- Caching
- CDN for assets
- Service worker

---

## 📊 Monitoring

### **Error Tracking**

#### **Sentry**
```bash
pnpm add @sentry/react @sentry/vite-plugin
```

```typescript
// apps/web/src/main.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'your-dsn',
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

---

### **Analytics**

#### **Google Analytics**
```typescript
// apps/web/src/analytics.ts
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');

export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: 'pageview', page: path });
};
```

---

## 🔒 Security

### **Content Security Policy**
```html
<!-- apps/web/index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: blob:; 
               media-src 'self' blob:; 
               worker-src 'self' blob:;">
```

### **HTTPS**
- Always use HTTPS in production
- Enable HSTS
- Use secure cookies
- Validate certificates

---

## 🧪 Testing Before Deploy

### **1. Build Locally**
```bash
pnpm build
```

### **2. Test Production Build**
```bash
cd apps/web
pnpm preview
```

### **3. Run Tests**
```bash
pnpm test
pnpm test:e2e
```

### **4. Check Bundle Size**
```bash
pnpm build --analyze
```

### **5. Lighthouse Audit**
- Open in Chrome
- DevTools → Lighthouse
- Run audit
- Fix issues

---

## 📦 Release Checklist

### **Before Release**
- [ ] All tests passing
- [ ] No console errors
- [ ] Bundle size acceptable
- [ ] Performance optimized
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped

### **Release Process**
1. Create release branch
2. Update version numbers
3. Update CHANGELOG.md
4. Commit changes
5. Create git tag
6. Push to GitHub
7. CI/CD builds and deploys
8. Verify deployment
9. Announce release

---

## 🚨 Rollback Plan

### **Web App**
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

### **Desktop App**
- Publish hotfix release
- Auto-updater will download
- Users get update automatically

### **Mobile App**
- Submit hotfix to stores
- Wait for approval
- Users update manually

---

## 📈 Post-Deployment

### **Monitor**
- Error rates
- Performance metrics
- User feedback
- Crash reports
- Analytics

### **Optimize**
- Fix bugs
- Improve performance
- Add features
- Update dependencies

---

## 🆘 Troubleshooting

### **Build Fails**
```bash
# Clear cache
rm -rf node_modules dist .turbo
pnpm install
pnpm build
```

### **Deploy Fails**
- Check build logs
- Verify environment variables
- Check file permissions
- Verify dependencies

### **App Crashes**
- Check error logs
- Review Sentry reports
- Test locally
- Deploy hotfix

---

## 📞 Support

- **Documentation:** [docs.omnicut.app](https://docs.omnicut.app)
- **GitHub Issues:** [github.com/omnicut/omnicut/issues](https://github.com/omnicut/omnicut/issues)
- **Discord:** [discord.gg/omnicut](https://discord.gg/omnicut)

---

**Ready to deploy OmniCut to the world! 🚀**

*Last Updated: May 6, 2026*
