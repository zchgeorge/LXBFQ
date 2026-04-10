# Deployment Guide

This guide covers various deployment options for OpenClaw Music Player.

## 🚀 Quick Deploy

### Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/openclaw/openclaw-music-player)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Select the repository
4. Vercel will automatically detect the settings
5. Click "Deploy"

### Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/openclaw/openclaw-music-player)

1. Click the "Deploy to Netlify" button
2. Connect to GitHub
3. Configure build settings:
   - Build command: `npm run build` (or leave empty for static)
   - Publish directory: `public`
4. Click "Deploy site"

### Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: `openclaw-music-player`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

## 🐳 Docker Deployment

### Build Docker Image
```bash
docker build -t openclaw-music-player .
```

### Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/uploads:/app/uploads \
  --name music-player \
  openclaw-music-player
```

### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  music-player:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## ☁️ Cloud Providers

### AWS (Elastic Beanstalk)
1. Install EB CLI: `npm install -g aws-elasticbeanstalk-cli`
2. Initialize: `eb init`
3. Create environment: `eb create`
4. Deploy: `eb deploy`

### Google Cloud (App Engine)
Create `app.yaml`:
```yaml
runtime: nodejs18
env: standard
manual_scaling:
  instances: 1
resources:
  cpu: 1
  memory_gb: 0.5
  disk_size_gb: 10
```

Deploy:
```bash
gcloud app deploy
```

### Azure (App Service)
```bash
# Create resource group
az group create --name music-player-rg --location eastus

# Create app service plan
az appservice plan create \
  --name music-player-plan \
  --resource-group music-player-rg \
  --sku B1 \
  --is-linux

# Create web app
az webapp create \
  --resource-group music-player-rg \
  --plan music-player-plan \
  --name openclaw-music-player \
  --runtime "NODE|18-lts"

# Deploy from GitHub
az webapp deployment source config \
  --name openclaw-music-player \
  --resource-group music-player-rg \
  --repo-url https://github.com/openclaw/openclaw-music-player \
  --branch main
```

## 🖥️ Traditional Hosting

### PM2 (Production Process Manager)
```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start src/server.js --name "music-player"

# Save process list
pm2 save

# Setup startup script
pm2 startup

# Monitor
pm2 monit
```

### Nginx Reverse Proxy
Create `/etc/nginx/sites-available/music-player`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # File upload size limit
    client_max_body_size 50M;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/music-player /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Systemd Service
Create `/etc/systemd/system/music-player.service`:
```ini
[Unit]
Description=OpenClaw Music Player
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/music-player
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable music-player
sudo systemctl start music-player
```

## 📦 Environment Variables

Create `.env` file:
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
MAX_FILE_SIZE=52428800
UPLOAD_PATH=./uploads
LOG_LEVEL=info
```

## 🔒 Security Considerations

### SSL/TLS
- Use Let's Encrypt for free certificates
- Configure HTTPS redirect
- Enable HSTS headers

### File Upload Security
- Validate file types
- Limit file size (default: 50MB)
- Scan for malware (if possible)
- Store files outside web root

### API Security
- Rate limiting
- Input validation
- CORS configuration
- Error handling without sensitive info

## 📊 Monitoring

### Logging
```bash
# View logs
tail -f logs/combined.log

# Error logs only
tail -f logs/error.log
```

### Health Checks
```bash
# Manual check
curl https://your-domain.com/api/health

# Automated monitoring
# Use UptimeRobot, Pingdom, etc.
```

### Performance Monitoring
- Use PM2 monitoring
- Implement New Relic or Datadog
- Monitor disk space for uploads

## 🔄 Continuous Deployment

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run build
      # Add deployment steps for your provider
```

## 🗄️ Database (Optional)

For persistent playlists, add a database:

### MongoDB
```bash
npm install mongoose
```

### PostgreSQL
```bash
npm install pg sequelize
```

### SQLite
```bash
npm install sqlite3 better-sqlite3
```

## 🌐 CDN for Static Files

For better performance:
- Upload audio files to CDN (AWS S3, Cloudflare R2)
- Serve static assets via CDN
- Implement caching headers

## 📱 PWA (Progressive Web App)

Enable PWA features:
1. Add `manifest.json`
2. Implement service worker
3. Add offline support
4. Enable install prompt

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port
   sudo lsof -i :3000
   # Kill process
   sudo kill -9 <PID>
   ```

2. **File upload permissions**
   ```bash
   sudo chown -R node:node uploads
   sudo chmod -R 755 uploads
   ```

3. **Memory issues**
   ```bash
   # Increase memory limit
   node --max-old-space-size=4096 src/server.js
   ```

4. **Database connection**
   - Check connection string
   - Verify network access
   - Check firewall rules

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm start

# Or with custom debug namespace
DEBUG=music-player:* npm start
```

## 📞 Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test locally first
4. Check firewall/security groups
5. Review provider documentation

---

**Happy Deployment!** 🚀