#!/bin/bash

# Push OpenClaw Music Player to GitHub
# Usage: ./push-to-github.sh [GITHUB_USERNAME]

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 OpenClaw Music Player - GitHub Upload Script${NC}"
echo ""

# Check if in project directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in music-player project directory${NC}"
    echo "Please run this script from the music-player folder"
    exit 1
fi

# Check Git status
echo -e "${BLUE}[1/5] Checking Git status...${NC}"
if [ ! -d ".git" ]; then
    echo -e "${RED}❌ Error: Not a Git repository${NC}"
    exit 1
fi

git status --short

# Get GitHub username
if [ -n "$1" ]; then
    GITHUB_USER="$1"
else
    read -p "Enter your GitHub username: " GITHUB_USER
fi

if [ -z "$GITHUB_USER" ]; then
    echo -e "${RED}❌ Error: GitHub username is required${NC}"
    exit 1
fi

REPO_NAME="openclaw-music-player"
REPO_URL="https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo -e "${BLUE}[2/5] Setting up remote repository...${NC}"
echo "Repository: ${REPO_URL}"

# Check if remote already exists
if git remote | grep -q "^origin$"; then
    echo -e "${YELLOW}⚠️  Remote 'origin' already exists${NC}"
    read -p "Do you want to update it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote set-url origin "$REPO_URL"
        echo -e "${GREEN}✅ Updated remote 'origin'${NC}"
    else
        echo -e "${YELLOW}⚠️  Keeping existing remote${NC}"
    fi
else
    git remote add origin "$REPO_URL"
    echo -e "${GREEN}✅ Added remote 'origin'${NC}"
fi

echo ""
echo -e "${BLUE}[3/5] Creating GitHub repository...${NC}"
echo -e "${YELLOW}Note: You need to create the repository on GitHub first:${NC}"
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
echo -e "${BLUE}[4/5] Pushing code to GitHub...${NC}"

# Push to GitHub
if git push -u origin main; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Push failed. Trying force push...${NC}"
    read -p "Do you want to force push? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push -u origin main --force
        echo -e "${GREEN}✅ Force push successful!${NC}"
    else
        echo -e "${YELLOW}⚠️  Push cancelled${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}[5/5] Verifying push...${NC}"
git log --oneline -5

echo ""
echo -e "${GREEN}🎉 OpenClaw Music Player successfully uploaded to GitHub!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Visit your repository: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo "2. Add a project description"
echo "3. Set up GitHub Pages (optional)"
echo "4. Enable Issues and Discussions"
echo "5. Add collaborators"
echo ""
echo -e "${BLUE}🔗 Repository URLs:${NC}"
echo "• HTTPS: https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
echo "• SSH: git@github.com:${GITHUB_USER}/${REPO_NAME}.git"
echo "• Web: https://github.com/${GITHUB_USER}/${REPO_NAME}"
echo ""
echo -e "${BLUE}🚀 Deployment Options:${NC}"
echo "• Vercel: https://vercel.com/new"
echo "• Netlify: https://app.netlify.com/start"
echo "• Render: https://render.com"
echo ""
echo -e "${GREEN}Enjoy your open-source music player! 🎵${NC}"