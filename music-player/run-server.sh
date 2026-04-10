#!/bin/bash

echo "🚀 启动音乐播放器服务器..."

# 检查是否已在运行
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 服务器已在运行"
    echo "📁 访问地址: http://localhost:3000"
    exit 0
fi

# 启动服务器
cd /root/.openclaw/workspace/music-player
node simple-server.js > server.log 2>&1 &
SERVER_PID=$!

echo "🔧 服务器PID: $SERVER_PID"
echo $SERVER_PID > server.pid

# 等待启动
sleep 3

# 检查是否启动成功
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ 服务器启动成功！"
    echo "📁 访问地址: http://localhost:3000"
    echo "📝 日志文件: server.log"
    echo "🛑 停止命令: kill \$(cat server.pid)"
else
    echo "❌ 服务器启动失败"
    echo "📝 查看日志: tail -f server.log"
    exit 1
fi

echo ""
echo "🎵 现在可以打开浏览器访问: http://localhost:3000"