# 🔧 OmniCut - Troubleshooting Guide

**Issue:** Blank white page at http://localhost:5173/

---

## ✅ What I've Done

### 1. **Added Error Boundary** ✅
- Created `ErrorBoundary.tsx` component
- Integrated into `main.tsx`
- Now shows detailed error messages instead of blank page

### 2. **Created Safe Test Apps** ✅
- `App-safe.tsx` - Minimal test component
- `App-minimal.tsx` - Basic React test
- `test-import.ts` - Import test file

### 3. **Verified Configuration** ✅
- Vite config has correct aliases
- HTML has root element
- Packages are built (core, store, media-engine)

---

## 🎯 Current Status

**Dev Server:** Running at http://localhost:5173/

**What You Should See Now:**
- Either the full OmniCut app working
- OR a detailed error message showing what's wrong

---

## 🔍 Debugging Steps

### Step 1: Check Browser Console
Open browser developer tools (F12) and check:
1. **Console tab** - Look for red error messages
2. **Network tab** - Check if files are loading
3. **Sources tab** - Verify files are present

### Step 2: Check What's Showing
**If you see an error message:**
- Read the error details
- Copy the error message
- Share it with me

**If still blank:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear cache and reload
- Try incognito/private window

### Step 3: Common Issues & Fixes

#### Issue: "Cannot find module '@omnicut/store'"
**Fix:**
```bash
# Rebuild all packages
pnpm build

# Restart dev server
# (Stop with Ctrl+C, then)
pnpm dev
```

#### Issue: "Unexpected token" or "Syntax error"
**Fix:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
pnpm dev
```

#### Issue: "Failed to fetch dynamically imported module"
**Fix:**
```bash
# Hard refresh browser
Ctrl+Shift+R

# Or clear browser cache
```

---

## 🚀 Quick Fixes

### Fix 1: Rebuild Everything
```bash
# From project root
pnpm build

# Then restart dev server
cd apps/web
pnpm dev
```

### Fix 2: Clean Install
```bash
# Remove all node_modules
rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf packages/*/node_modules

# Reinstall
pnpm install

# Rebuild
pnpm build

# Start dev server
cd apps/web
pnpm dev
```

### Fix 3: Use Minimal App
If the full app has errors, test with minimal version:

**Edit `apps/web/src/main.tsx`:**
```typescript
// Change this line:
import App from './App';

// To this:
import App from './App-minimal';
```

This will show a simple test page to verify React is working.

---

## 📊 What to Check

### Browser Console Errors
Look for these common errors:

**1. Import Errors:**
```
Failed to resolve module specifier "@omnicut/store"
```
**Fix:** Run `pnpm build`

**2. Runtime Errors:**
```
Cannot read property 'X' of undefined
```
**Fix:** Check if stores are initialized

**3. Network Errors:**
```
404 Not Found
```
**Fix:** Check if files exist, restart dev server

### Dev Server Output
Check terminal for:
- ✅ "ready in XXXms" - Server started
- ❌ "Error" messages - Build errors
- ⚠️ Warnings - Usually safe to ignore

---

## 🎬 Expected Behavior

### When Working Correctly:
1. Open http://localhost:5173/
2. See OmniCut interface with:
   - Menu bar at top
   - Media Pool on left
   - Timeline in center
   - Effects panel on right
3. Can click buttons and interact

### With Error Boundary:
1. Open http://localhost:5173/
2. See error message with:
   - Error description
   - Stack trace
   - Reload button
3. Error details help identify the problem

---

## 💡 Most Likely Issues

### 1. **Packages Not Built** (90% of cases)
**Symptom:** Blank page or import errors  
**Fix:**
```bash
pnpm build
```

### 2. **Vite Cache Issue** (5% of cases)
**Symptom:** Old code showing or weird errors  
**Fix:**
```bash
rm -rf node_modules/.vite
pnpm dev
```

### 3. **Browser Cache** (3% of cases)
**Symptom:** Blank page after changes  
**Fix:** Hard refresh (Ctrl+Shift+R)

### 4. **Port Already in Use** (2% of cases)
**Symptom:** Server won't start  
**Fix:** Kill process on port 5173 or use different port

---

## 🔄 Step-by-Step Recovery

### Complete Reset:
```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clean everything
rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf packages/*/node_modules
rm -rf apps/web/dist
rm -rf packages/*/dist

# 3. Reinstall
pnpm install

# 4. Rebuild packages
pnpm build

# 5. Start dev server
cd apps/web
pnpm dev

# 6. Open browser
# http://localhost:5173/
```

---

## 📞 What to Report

If still having issues, please share:

1. **What you see:**
   - Blank white page?
   - Error message? (copy full text)
   - Partial UI?

2. **Browser console:**
   - Any red errors?
   - Any warnings?

3. **Terminal output:**
   - Any errors when running `pnpm dev`?
   - Any errors when running `pnpm build`?

4. **Steps tried:**
   - Which fixes did you try?
   - What was the result?

---

## ✅ Verification Checklist

Before reporting issues, verify:

- [ ] Dev server is running (check terminal)
- [ ] No errors in terminal
- [ ] Browser is on http://localhost:5173/
- [ ] Browser console is open (F12)
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Tried `pnpm build`
- [ ] Checked for error messages

---

## 🎯 Next Steps

**Right Now:**
1. Open http://localhost:5173/ in your browser
2. Open browser console (F12)
3. Look for any error messages
4. Share what you see

**If You See Errors:**
- Copy the error message
- Share it with me
- I'll provide specific fix

**If Still Blank:**
- Try hard refresh (Ctrl+Shift+R)
- Try incognito window
- Check browser console for errors

---

*Troubleshooting Guide - May 7, 2026*  
*Status: Error Boundary Added*  
*Next: Check browser for error details*

**🔍 Open http://localhost:5173/ and check what you see!**

