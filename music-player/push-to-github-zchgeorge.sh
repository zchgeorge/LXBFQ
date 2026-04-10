#!/bin/bash

echo "🚀 推送到 GitHub: zchgeorge/openclaw-music-player"
echo "=========================================="

# 检查当前配置
echo "📊 当前Git配置:"
git remote -v
echo ""

echo "📝 最近提交:"
git log --oneline -3
echo ""

echo "📁 文件数量:" $(git ls-files | wc -l)
echo ""

# 尝试推送
echo "🚀 开始推送到GitHub..."
echo "仓库: https://github.com/zchgeorge/openclaw-music-player.git"
echo ""

# 推送命令
if git push -u origin main; then
    echo ""
    echo "🎉 推送成功！"
    echo "✅ 项目已上传到GitHub"
    echo "🌐 访问: https://github.com/zchgeorge/openclaw-music-player"
    echo ""
    echo "📋 下一步:"
    echo "1. 设置仓库描述和标签"
    echo "2. 启用Issues和Discussions"
    echo "3. 考虑一键部署到Vercel/Netlify"
else
    echo ""
    echo "❌ 推送失败"
    echo ""
    echo "🔧 可能的原因:"
    echo "1. GitHub仓库不存在 - 请先创建: https://github.com/new"
    echo "2. 认证失败 - 可能需要Personal Access Token"
    echo "3. 网络问题 - 检查网络连接"
    echo ""
    echo "💡 解决方案:"
    echo "1. 确保已创建仓库: openclaw-music-player"
    echo "2. 使用token认证而不是密码"
    echo "3. 尝试使用SSH: git@github.com:zchgeorge/openclaw-music-player.git"
fi

echo ""
echo "📞 如果需要帮助，请提供错误信息"