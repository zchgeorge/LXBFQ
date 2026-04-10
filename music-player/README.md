# 🎵 OpenClaw Music Player

[![GitHub stars](https://img.shields.io/github/stars/openclaw/openclaw-music-player?style=social)](https://github.com/openclaw/openclaw-music-player/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/openclaw/openclaw-music-player?style=social)](https://github.com/openclaw/openclaw-music-player/network/members)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/openclaw/openclaw-music-player/pulls)

A modern, open-source web-based music player built with Node.js and vanilla JavaScript. Features a beautiful dark theme, full keyboard support, drag & drop uploads, and responsive design.

## ✨ Features

### 🎶 Core Player
- **Play/Pause/Next/Previous** controls
- **Progress bar** with click-to-seek
- **Volume control** with mute option
- **Shuffle** and **Repeat** modes
- **Keyboard shortcuts** (Space, Arrow keys, etc.)

### 📁 Playlist Management
- **Drag & drop** file upload
- **Multiple format support** (MP3, WAV, OGG, FLAC, M4A, AAC)
- **Visual playlist** with active song highlighting
- **Clear playlist** functionality

### 🎨 Modern UI
- **Responsive design** for all devices
- **Dark theme** with gradient accents
- **Album art** display area
- **Real-time status** updates
- **Smooth animations** and transitions

### 🔧 Technical Features
- **RESTful API** backend
- **File upload** with progress indicator
- **Error handling** and user feedback
- **Comprehensive logging**
- **Easy deployment** options

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/openclaw/openclaw-music-player.git
cd openclaw-music-player

# Install dependencies
npm install

# Start development server
npm run dev

# Or use the simple server
npm run simple
```

### Access the Player
Open your browser and navigate to:
```
http://localhost:3000
```

## 📁 Project Structure

```
openclaw-music-player/
├── src/
│   └── server.js          # Express server with API endpoints
├── public/
│   ├── index.html         # Main HTML interface
│   ├── style.css          # CSS styles
│   ├── script.js          # Frontend JavaScript
│   └── test.html          # Functionality test page
├── tests/
│   └── server.test.js     # Test suite
├── uploads/               # Uploaded music files (auto-created)
├── package.json          # Dependencies and scripts
├── README.md            # This file
├── LICENSE              # MIT License
├── CONTRIBUTING.md      # Contribution guidelines
├── DEPLOYMENT.md        # Deployment guide
├── .gitignore          # Git ignore rules
└── start.sh            # Startup script
```

## 🎮 Usage Guide

### Adding Music
1. Click **"Add Songs"** button
2. **Drag & drop** audio files or click to browse
3. Files will be uploaded and added to playlist
4. Click any song in playlist to play

### Keyboard Shortcuts
- **Space**: Play/Pause
- **Arrow Left**: Previous song
- **Arrow Right**: Next song
- **M**: Mute/Unmute
- **S**: Toggle shuffle
- **R**: Toggle repeat
- **Escape**: Close upload dialog

### Controls
- **Play/Pause**: Toggle playback
- **Previous/Next**: Navigate playlist
- **Shuffle**: Random song order
- **Repeat**: Loop current song or playlist
- **Volume**: Adjust audio level
- **Progress Bar**: Click to seek

## 🔧 API Endpoints

### Server Info
- `GET /api/health` - Health check
- `GET /api/info` - Server information
- `GET /api/files` - List uploaded files

### File Management
- `POST /api/upload` - Upload music files
- `DELETE /api/files/:filename` - Delete file

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Test functionality page
# Open http://localhost:3000/test.html
```

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot play audio file"**
   - Check file format (supported: MP3, WAV, OGG, FLAC, M4A, AAC)
   - Ensure file is not corrupted
   - Check browser console for errors

2. **Upload fails**
   - Check file size (max 50MB)
   - Ensure stable internet connection
   - Check server logs for errors

3. **Player not responding**
   - Refresh the page
   - Check JavaScript console for errors
   - Restart the server

### Logs
Check server logs for detailed error information:
```bash
# View server logs
tail -f server.log
```

## 🔒 Security Notes

- File uploads are sanitized
- Maximum file size: 50MB
- Only audio files are accepted
- Uploaded files are stored locally
- No user authentication (for local use only)

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 🚀 Deployment

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/openclaw/openclaw-music-player)

### Manual Deployment
```bash
# Install production dependencies only
npm install --production

# Start server
npm start

# Or use process manager like PM2
pm2 start src/server.js --name "music-player"
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment options.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons by [Font Awesome](https://fontawesome.com/)
- Sample music from [Mixkit](https://mixkit.co/)
- Built with [OpenClaw](https://openclaw.ai/) AI assistance

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review server logs
3. Open an issue on GitHub

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=openclaw/openclaw-music-player&type=Date)](https://star-history.com/#openclaw/openclaw-music-player&Date)

---

**Enjoy your music!** 🎧

[⬆ Back to Top](#-openclaw-music-player)