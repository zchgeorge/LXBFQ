#!/bin/bash

echo "🚀 OpenClaw Music Player - GitHub Upload"
echo ""

# Check if in project directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in music-player project directory"
    echo "Please run this script from the music-player folder"
    exit 1
fi

# Check Git status
echo "[1/5] Checking Git status..."
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a Git repository"
    exit 1
fi

git status --short

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USER

if [ -z "$GITHUB_USER" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

REPO_NAME="openclaw-music-player"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "[2/5] Setting up remote repository..."
echo "Repository: ${REPO_URL}"

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo "⚠️  Remote 'origin' already exists"
    read -p "Do you want to update it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "$REPO_URL"
        echo "✅ Updated remote 'origin'"
    else
        echo "⚠️  Keeping existing remote"
    fi
else
    git remote add origin "$REPO_URL"
    echo "✅ Added remote 'origin'"
fi

echo ""
echo "[3/5] Creating GitHub repository..."
echo "Note: You need to create the repository on GitHub first:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: ${REPO_NAME}"
echo "3. Description: A modern, open-source web-based music player"
echo "4. Keep it Public"
echo "5. DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
read -p "Press Enter after creating the repository..." -n 1 -r
echo

echo ""
echo "[4/5] Pushing code to GitHub..."

# Push to GitHub
if git push -u origin main; then
    echo "✅ Successfully pushed to GitHub!"
else
    echo "❌ Push failed. Trying force push..."
    read -p "Do you want to force push? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main --force
        echo "✅ Force push successful!"
    else
        echo "⚠️  Push cancelled"
        exit 1
    fi
fi

echo ""
echo "[5/5] Verifying push..."
git log --oneline -5

echo ""
echo "🎉 OpenClaw Music Player successfully uploaded to GitHub!"
echo ""
echo "📋 Next Steps:"
echo "1. Visit your repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "2. Add a project description"
echo "3. Set up GitHub Pages (optional)"
echo "4. Enable Issues and Discussions"
echo ""
echo "🔗 Repository URLs:"
echo "• HTTPS: https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo "• SSH: git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
echo "• Web: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo "🚀 Deployment Options:"
echo "• Vercel: https://vercel.com/new"
echo "• Netlify: https://app.netlify.com/start"
echo "• Render: https://render.com"
echo ""
echo "Enjoy your open-source music player! 🎵"