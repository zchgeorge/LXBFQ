# Windows上传到GitHub指南

## 第一步：在Windows上打开项目

### 方法A：通过WSL2访问
1. 打开 **Windows PowerShell**
2. 输入：
```powershell
# 进入WSL2中的项目目录
wsl
cd /root/.openclaw/workspace/music-player
```

### 方法B：直接访问Windows路径
项目在Windows中的路径：
```
\\wsl$\Ubuntu-25.10\root\.openclaw\workspace\music-player\
```
或
```
E:\wsl\root\.openclaw\workspace\music-player\  # 根据你的WSL2安装位置
```

## 第二步：创建GitHub仓库

### 通过浏览器创建：
1. 打开浏览器访问：**https://github.com/new**
2. 登录你的GitHub账户（用户名：yuleann）
3. 填写：
   - Repository name: **openclaw-music-player**
   - Description: A modern, open-source web-based music player
   - 选择 **Public**
   - **不要**勾选：README, .gitignore, LICENSE
4. 点击 **Create repository**

## 第三步：在Windows中执行Git命令

### 在PowerShell中运行：
```powershell
# 如果已经在WSL2中
cd /root/.openclaw/workspace/music-player

# 检查远程配置
git remote -v

# 如果远程已设置（应该显示yuleann的URL），直接推送：
git push -u origin main
```

### 如果遇到认证问题：
1. **第一次推送会要求登录**：
   - 用户名：输入你的GitHub用户名（yuleann）
   - 密码：**不要输入密码**，使用Personal Access Token

2. **获取Personal Access Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token"
   - 选择权限：**repo**（完全控制仓库）
   - 生成并复制token

3. **在密码提示中使用token**：
   - 当Git要求密码时，粘贴token

## 第四步：验证上传

### 检查上传状态：
```powershell
# 查看推送状态
git status

# 查看远程分支
git branch -r
```

### 访问GitHub仓库：
上传成功后，访问：
```
https://github.com/yuleann/openclaw-music-player
```

## 故障排除

### 1. "Repository not found" 错误
说明仓库不存在，需要先创建：
```powershell
# 删除错误配置
git remote remove origin

# 创建仓库后重新添加
git remote add origin https://github.com/yuleann/openclaw-music-player.git
git push -u origin main
```

### 2. 认证失败
```powershell
# 清除保存的凭据
git config --global --unset credential.helper

# Windows凭据管理器
# 打开：控制面板 → 用户账户 → 凭据管理器
# 删除GitHub相关凭据
```

### 3. 使用SSH密钥（推荐）
```powershell
# 生成SSH密钥（如果还没有）
ssh-keygen -t ed25519 -C "yuleann@163.com"

# 将公钥添加到GitHub
# 复制：C:\Users\你的用户名\.ssh\id_ed25519.pub 的内容
# 添加到：https://github.com/settings/keys

# 使用SSH URL
git remote set-url origin git@github.com:yuleann/openclaw-music-player.git
```

## 一键上传脚本

创建 `upload.bat` 文件：
```batch
@echo off
echo 🚀 OpenClaw Music Player - GitHub Upload
echo.

cd /d "C:\你的路径\music-player" 2>nul
if errorlevel 1 (
    echo ❌ 找不到项目目录
    pause
    exit /b 1
)

echo 📊 检查Git状态...
git status --short

echo.
echo 🔗 远程仓库配置：
git remote -v

echo.
echo 🚀 开始推送到GitHub...
git push -u origin main

if errorlevel 1 (
    echo ❌ 推送失败
    echo 💡 可能原因：
    echo   1. GitHub仓库不存在
    echo   2. 认证失败
    echo   3. 网络问题
) else (
    echo ✅ 推送成功！
    echo 🌐 访问：https://github.com/yuleann/openclaw-music-player
)

pause
```

## 成功后的操作

### 1. 设置仓库信息
- 添加项目描述
- 设置主题标签：`music-player`, `audio`, `web`, `nodejs`
- 上传封面图片

### 2. 启用功能
- Issues（问题跟踪）
- Discussions（讨论区）
- GitHub Pages（可选）
- Actions（CI/CD）

### 3. 一键部署
- Vercel：https://vercel.com/new
- Netlify：https://app.netlify.com/start
- Render：https://render.com

## 获取帮助

如果仍然无法上传：
1. 截图错误信息
2. 检查Git版本：`git --version`
3. 确保网络可以访问GitHub
4. 尝试使用GitHub Desktop客户端

---

**现在请先创建GitHub仓库，然后运行推送命令！** 🚀