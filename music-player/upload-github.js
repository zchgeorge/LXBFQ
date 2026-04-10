#!/usr/bin/env node

/**
 * OpenClaw Music Player - GitHub Upload Helper
 * This script helps upload the project to GitHub
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎵 OpenClaw Music Player - GitHub Upload Helper');
console.log('=' .repeat(50));

// Check if in project directory
try {
  execSync('git status', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: Not in a Git repository or not in project directory');
  console.error('Please run this script from the music-player folder');
  process.exit(1);
}

// Show current status
console.log('\n📊 Current Git Status:');
try {
  const status = execSync('git status --short', { encoding: 'utf8' });
  console.log(status || '  (no changes)');
} catch (error) {
  console.log('  Unable to get status');
}

console.log('\n📝 Recent Commits:');
try {
  const log = execSync('git log --oneline -5', { encoding: 'utf8' });
  console.log(log);
} catch (error) {
  console.log('  Unable to get log');
}

// Ask for GitHub username
rl.question('\n🔧 Enter your GitHub username: ', (githubUser) => {
  if (!githubUser.trim()) {
    console.error('❌ GitHub username is required');
    rl.close();
    process.exit(1);
  }

  const repoUrl = `https://github.com/${githubUser.trim()}/openclaw-music-player.git`;
  
  console.log('\n📋 Instructions:');
  console.log('=' .repeat(50));
  console.log('\n1. FIRST, create the repository on GitHub:');
  console.log(`   Go to: https://github.com/new`);
  console.log(`   Repository name: openclaw-music-player`);
  console.log(`   Description: A modern, open-source web-based music player`);
  console.log(`   Keep it Public`);
  console.log(`   DO NOT initialize with README, .gitignore, or license`);
  console.log(`   Click "Create repository"`);
  
  console.log('\n2. THEN, run these commands in your terminal:');
  console.log('=' .repeat(50));
  console.log(`\n# Add remote repository`);
  console.log(`git remote add origin ${repoUrl}`);
  console.log(`\n# Push to GitHub`);
  console.log(`git push -u origin main`);
  
  console.log('\n3. ALTERNATIVELY, use this one-liner:');
  console.log('=' .repeat(50));
  console.log(`git remote add origin ${repoUrl} && git push -u origin main`);
  
  console.log('\n🎯 Expected Output:');
  console.log('=' .repeat(50));
  console.log(`
Enumerating objects: 19, done.
Counting objects: 100% (19/19), done.
Delta compression using up to 8 threads
Compressing objects: 100% (17/17), done.
Writing objects: 100% (19/19), 45.32 KiB | 2.27 MiB/s, done.
Total 19 (delta 2), reused 0 (delta 0), pack-reused 0
remote: Resolving deltas: 100% (2/2), done.
To https://github.com/${githubUser.trim()}/openclaw-music-player.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
  `);
  
  console.log('\n✅ After successful upload:');
  console.log(`   Visit: https://github.com/${githubUser.trim()}/openclaw-music-player`);
  
  console.log('\n🚀 Quick Deploy Options:');
  console.log('=' .repeat(50));
  console.log('\n• Vercel: https://vercel.com/new');
  console.log('• Netlify: https://app.netlify.com/start');
  console.log('• Render: https://render.com');
  
  console.log('\n📞 Need help?');
  console.log('=' .repeat(50));
  console.log('\nCommon issues:');
  console.log('1. Repository already exists → Use: git remote set-url origin NEW_URL');
  console.log('2. Authentication failed → Make sure you have GitHub credentials set up');
  console.log('3. Push rejected → Try: git push -u origin main --force');
  
  rl.close();
  
  // Ask if user wants to run commands now
  const rl2 = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  rl2.question('\n🔧 Do you want to run the Git commands now? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      console.log('\n🚀 Running Git commands...');
      try {
        console.log(`\nAdding remote: ${repoUrl}`);
        execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
        
        console.log('\nPushing to GitHub...');
        execSync('git push -u origin main', { stdio: 'inherit' });
        
        console.log('\n🎉 Success! Your project is now on GitHub!');
        console.log(`Visit: https://github.com/${githubUser.trim()}/openclaw-music-player`);
      } catch (error) {
        console.error('\n❌ Error during Git operations:');
        console.error(error.message);
        console.log('\n💡 Try running the commands manually:');
        console.log(`git remote add origin ${repoUrl}`);
        console.log('git push -u origin main');
      }
    } else {
      console.log('\n📝 Commands saved. Run them when ready:');
      console.log(`git remote add origin ${repoUrl}`);
      console.log('git push -u origin main');
    }
    
    rl2.close();
    console.log('\n🎵 OpenClaw Music Player - Ready for GitHub!');
  });
});