#!/bin/bash

# Quick deployment script for Amazon Interview Prep Dashboard
# This script helps you prepare and deploy your app

echo "🚀 Amazon Interview Prep Dashboard - Deployment Helper"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git not initialized. Run: git init"
    exit 1
fi

# Check if remote is set
if ! git remote | grep -q origin; then
    echo "⚠️  No GitHub remote found."
    echo ""
    echo "📝 Next steps:"
    echo "1. Create a repository on GitHub"
    echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "3. Replace YOUR_USERNAME and YOUR_REPO_NAME with your actual values"
    echo ""
    read -p "Press Enter after you've added the remote..."
fi

echo "📦 Staging all files..."
git add .

echo "💾 Creating commit..."
git commit -m "Initial commit: Amazon Interview Prep Dashboard"

echo "🌿 Setting main branch..."
git branch -M main

echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🎯 Next steps:"
echo "1. Go to https://vercel.com (or netlify.com)"
echo "2. Sign up/login with GitHub"
echo "3. Import your repository"
echo "4. Deploy! 🚀"
echo ""
echo "Your app will be live in minutes!"
