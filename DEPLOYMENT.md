# Deployment Guide

This guide will help you deploy your Amazon Interview Prep Dashboard online.

## Option 1: Deploy to Vercel (Recommended - Easiest)

### Step 1: Push to GitHub

1. **Create a GitHub repository:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it something like `amazon-interview-prep` or `amazon-prep-dashboard`
   - Don't initialize with README (we already have one)

2. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit: Amazon Interview Prep Dashboard"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

### Step 2: Deploy to Vercel

1. **Sign up/Login to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account (free)

2. **Import your project:**
   - Click "Add New Project"
   - Select your GitHub repository
   - Vercel will auto-detect it's a Vite project
   - Click "Deploy"

3. **That's it!** 
   - Vercel will build and deploy your app
   - You'll get a URL like `https://your-app-name.vercel.app`
   - Every push to main branch will auto-deploy

---

## Option 2: Deploy to Netlify

### Step 1: Push to GitHub (same as above)

### Step 2: Deploy to Netlify

1. **Sign up/Login to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up with your GitHub account (free)

2. **Import your project:**
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository
   - Build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Deploy site"

3. **Done!**
   - You'll get a URL like `https://your-app-name.netlify.app`
   - Auto-deploys on every push

---

## Option 3: Deploy to Cloudflare Pages

1. **Push to GitHub** (same as above)

2. **Go to Cloudflare Pages:**
   - Visit [pages.cloudflare.com](https://pages.cloudflare.com)
   - Sign in with your GitHub account

3. **Create a project:**
   - Click "Create a project"
   - Connect your GitHub repository
   - Build settings:
     - **Framework preset:** Vite
     - **Build command:** `npm run build`
     - **Build output directory:** `dist`

4. **Deploy!**
   - Click "Save and Deploy"
   - Get your URL: `https://your-app-name.pages.dev`

---

## Quick Start Commands

If you haven't committed your code yet, run these commands:

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Amazon Interview Prep Dashboard"

# Create main branch
git branch -M main
```

Then follow the steps above to push to GitHub and deploy.

---

## Important Notes

- **All deployments are FREE** on these platforms
- **Auto-deployment:** Every time you push to GitHub, your site will automatically update
- **Custom domains:** You can add your own domain name later
- **HTTPS:** All platforms provide free SSL certificates

---

## Troubleshooting

### Build fails?
- Make sure all dependencies are in `package.json`
- Check that `npm run build` works locally first

### Site works but localStorage doesn't persist?
- This is normal - localStorage is browser-specific
- Users' data will persist in their own browsers
- Consider adding cloud sync in the future if needed

### Need to update the site?
- Just push changes to GitHub
- The platform will automatically rebuild and deploy

---

## Recommended: Vercel

Vercel is recommended because:
- ✅ Easiest setup
- ✅ Best performance
- ✅ Great developer experience
- ✅ Automatic HTTPS
- ✅ Free custom domains
- ✅ Perfect for React/Vite apps
