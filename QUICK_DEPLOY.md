# Quick Deployment Guide 🚀

## Fastest Way to Deploy (5 minutes)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Name it: `amazon-interview-prep` (or any name you like)
3. **Don't** check "Initialize with README"
4. Click "Create repository"

### Step 2: Push Your Code

Run these commands in your terminal (in the project folder):

```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: Amazon Interview Prep Dashboard"

# Rename branch to main
git branch -M main

# Add your GitHub repository (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` and `YOUR_REPO_NAME`** with your actual GitHub username and the repository name you created.

### Step 3: Deploy to Vercel (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Click "Add New Project"
4. Select your `amazon-interview-prep` repository
5. Vercel auto-detects Vite - just click **"Deploy"**
6. Wait 1-2 minutes
7. **Done!** Your app is live at `https://your-app-name.vercel.app`

### Step 4: Share Your App! 🎉

Your dashboard is now online and accessible from anywhere!

---

## Alternative: Netlify

If you prefer Netlify:

1. Push to GitHub (Step 1 & 2 above)
2. Go to [netlify.com](https://netlify.com)
3. Sign up with GitHub
4. Click "Add new site" → "Import an existing project"
5. Select your repository
6. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Click "Deploy site"

---

## Need Help?

- **Build fails?** Make sure you ran `npm install` first
- **Can't push to GitHub?** Make sure you have Git installed and are logged in
- **Want a custom domain?** Both Vercel and Netlify offer free custom domains

---

## What Happens Next?

- ✅ Your app is live and accessible worldwide
- ✅ Every time you push code to GitHub, it auto-deploys
- ✅ Free HTTPS certificate included
- ✅ No credit card required

Enjoy your live dashboard! 🚀
