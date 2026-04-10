@echo off
echo 🚀 OpenClaw Music Player - GitHub上传工具
echo ==========================================
echo GitHub用户名: zchgeorge
echo 仓库: openclaw-music-player
echo.

echo 📋 步骤:
echo 1. 确保已创建GitHub仓库: https://github.com/new
echo 2. 仓库名: openclaw-music-player
echo 3. 不要初始化README/.gitignore/LICENSE
echo.

echo 🔧 正在推送到GitHub...
echo.

REM 通过WSL执行Git推送
wsl -d Ubuntu-25.10 -e bash -c "cd /root/.openclaw/workspace/music-player && ./push-to-github-zchgeorge.sh"

echo.
echo 💡 如果推送失败:
echo 1. 检查是否已创建GitHub仓库
echo 2. 可能需要GitHub Personal Access Token
echo 3. 访问: https://github.com/settings/tokens 创建token
echo.

echo 🌐 成功后可访问:
echo https://github.com/zchgeorge/openclaw-music-player
echo.

pause