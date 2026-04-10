// Music Player Application
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playlist = [];
        this.currentIndex = -1;
        this.isPlaying = false;
        this.isShuffle = false;
        this.isRepeat = false;
        this.volume = 0.8;
        
        this.initializeElements();
        this.setupEventListeners();
        this.loadSampleSongs();
        this.updateStatus('Ready to play music');
    }

    initializeElements() {
        // Player elements
        this.btnPlay = document.getElementById('btnPlay');
        this.btnPrev = document.getElementById('btnPrev');
        this.btnNext = document.getElementById('btnNext');
        this.btnShuffle = document.getElementById('btnShuffle');
        this.btnRepeat = document.getElementById('btnRepeat');
        this.btnVolume = document.getElementById('btnVolume');
        this.playIcon = document.getElementById('playIcon');
        
        // Progress elements
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.currentTimeEl = document.getElementById('currentTime');
        this.totalTimeEl = document.getElementById('totalTime');
        
        // Song info elements
        this.albumArt = document.getElementById('albumArt');
        this.songTitle = document.querySelector('.song-title');
        this.songArtist = document.querySelector('.song-artist');
        this.songAlbum = document.querySelector('.song-album');
        
        // Volume elements
        this.volumeSlider = document.getElementById('volumeSlider');
        this.volumeContainer = document.getElementById('volumeContainer');
        
        // Playlist elements
        this.playlistEl = document.getElementById('playlist');
        this.btnAddSongs = document.getElementById('btnAddSongs');
        this.btnClearPlaylist = document.getElementById('btnClearPlaylist');
        
        // Upload elements
        this.uploadSection = document.getElementById('uploadSection');
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.btnSelectFiles = document.getElementById('btnSelectFiles');
        this.btnCloseUpload = document.getElementById('btnCloseUpload');
        this.uploadProgress = document.getElementById('uploadProgress');
        this.uploadProgressFill = document.getElementById('uploadProgressFill');
        this.uploadPercent = document.getElementById('uploadPercent');
        this.uploadFileName = document.getElementById('uploadFileName');
        
        // Status element
        this.playerStatus = document.getElementById('playerStatus');
    }

    setupEventListeners() {
        // Audio event listeners
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateSongInfo());
        this.audio.addEventListener('ended', () => this.onSongEnd());
        this.audio.addEventListener('error', (e) => this.onAudioError(e));
        
        // Control button events
        this.btnPlay.addEventListener('click', () => this.togglePlay());
        this.btnPrev.addEventListener('click', () => this.playPrevious());
        this.btnNext.addEventListener('click', () => this.playNext());
        this.btnShuffle.addEventListener('click', () => this.toggleShuffle());
        this.btnRepeat.addEventListener('click', () => this.toggleRepeat());
        
        // Progress bar events
        this.progressBar.addEventListener('click', (e) => this.seekToPosition(e));
        
        // Volume events
        this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value / 100));
        this.btnVolume.addEventListener('click', () => this.toggleVolumeControl());
        
        // Playlist events
        this.btnAddSongs.addEventListener('click', () => this.showUploadSection());
        this.btnClearPlaylist.addEventListener('click', () => this.clearPlaylist());
        
        // Upload events
        this.btnSelectFiles.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.btnCloseUpload.addEventListener('click', () => this.hideUploadSection());
        
        // Drag and drop for upload
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = '#e94560';
            this.uploadArea.style.background = 'rgba(233, 69, 96, 0.1)';
        });
        
        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            this.uploadArea.style.background = 'transparent';
        });
        
        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            this.uploadArea.style.background = 'transparent';
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFiles(e.dataTransfer.files);
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    loadSampleSongs() {
        // Add some sample songs for testing
        // Using shorter test audio clips that are more reliable
        const sampleSongs = [
            {
                id: 1,
                title: 'Test Song 1',
                artist: 'Local Test',
                album: 'Test Album',
                duration: '0:30',
                url: 'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3'
            },
            {
                id: 2,
                title: 'Test Song 2',
                artist: 'Local Test',
                album: 'Test Album',
                duration: '0:30',
                url: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3'
            },
            {
                id: 3,
                title: 'Test Song 3',
                artist: 'Local Test',
                album: 'Test Album',
                duration: '0:30',
                url: 'https://assets.mixkit.co/music/preview/mixkit-deep-urban-623.mp3'
            }
        ];
        
        this.playlist = sampleSongs;
        this.renderPlaylist();
        this.updateStatus('Loaded sample songs');
    }

    // Player Controls
    togglePlay() {
        if (this.playlist.length === 0) {
            this.updateStatus('No songs in playlist');
            return;
        }
        
        if (this.currentIndex === -1) {
            this.playSong(0);
        } else if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play()
            .then(() => {
                this.isPlaying = true;
                this.playIcon.className = 'fas fa-pause';
                this.btnPlay.classList.add('active');
                this.updateStatus(`Playing: ${this.getCurrentSong().title}`);
            })
            .catch(error => {
                console.error('Play error:', error);
                this.updateStatus('Error playing song');
            });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playIcon.className = 'fas fa-play';
        this.btnPlay.classList.remove('active');
        this.updateStatus('Paused');
    }

    playSong(index) {
        if (index < 0 || index >= this.playlist.length) return;
        
        this.currentIndex = index;
        const song = this.playlist[index];
        
        this.audio.src = song.url;
        this.audio.load();
        
        // Update UI
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        this.songAlbum.textContent = song.album;
        
        // Update playlist highlight
        this.updatePlaylistHighlight();
        
        // Play the song
        this.play();
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) newIndex = this.playlist.length - 1;
        
        this.playSong(newIndex);
    }

    playNext() {
        if (this.playlist.length === 0) return;
        
        let newIndex;
        if (this.isShuffle) {
            newIndex = this.getRandomIndex();
        } else {
            newIndex = this.currentIndex + 1;
            if (newIndex >= this.playlist.length) {
                newIndex = this.isRepeat ? 0 : -1;
            }
        }
        
        if (newIndex !== -1) {
            this.playSong(newIndex);
        } else {
            this.pause();
            this.currentIndex = -1;
            this.updateStatus('Playlist ended');
        }
    }

    getRandomIndex() {
        if (this.playlist.length <= 1) return 0;
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.playlist.length);
        } while (newIndex === this.currentIndex && this.playlist.length > 1);
        
        return newIndex;
    }

    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.btnShuffle.classList.toggle('active', this.isShuffle);
        this.updateStatus(this.isShuffle ? 'Shuffle enabled' : 'Shuffle disabled');
    }

    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.btnRepeat.classList.toggle('active', this.isRepeat);
        this.updateStatus(this.isRepeat ? 'Repeat enabled' : 'Repeat disabled');
    }

    // Progress and Time
    updateProgress() {
        if (!this.audio.duration) return;
        
        const currentTime = this.audio.currentTime;
        const duration = this.audio.duration;
        const progressPercent = (currentTime / duration) * 100;
        
        this.progressFill.style.width = `${progressPercent}%`;
        this.currentTimeEl.textContent = this.formatTime(currentTime);
        this.totalTimeEl.textContent = this.formatTime(duration);
    }

    seekToPosition(e) {
        if (!this.audio.duration) return;
        
        const progressBar = this.progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - progressBar.left;
        const progressBarWidth = progressBar.width;
        const seekPercent = clickPosition / progressBarWidth;
        
        this.audio.currentTime = this.audio.duration * seekPercent;
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    updateSongInfo() {
        if (this.currentIndex >= 0) {
            const song = this.playlist[this.currentIndex];
            this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
        }
    }

    // Volume Control
    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));
        this.audio.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;
        
        // Update volume icon
        const volumeIcon = this.btnVolume.querySelector('i');
        if (this.volume === 0) {
            volumeIcon.className = 'fas fa-volume-mute';
        } else if (this.volume < 0.5) {
            volumeIcon.className = 'fas fa-volume-down';
        } else {
            volumeIcon.className = 'fas fa-volume-up';
        }
    }

    toggleVolumeControl() {
        this.volumeContainer.style.display = 
            this.volumeContainer.style.display === 'none' ? 'flex' : 'none';
    }

    // Playlist Management
    renderPlaylist() {
        this.playlistEl.innerHTML = '';
        
        if (this.playlist.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'playlist-empty';
            emptyItem.textContent = 'No songs in playlist. Click "Add Songs" to add music.';
            this.playlistEl.appendChild(emptyItem);
            return;
        }
        
        this.playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.className = index === this.currentIndex ? 'active' : '';
            li.dataset.index = index;
            
            li.innerHTML = `
                <i class="fas fa-music"></i>
                <div class="playlist-song-info">
                    <div class="playlist-song-title">${song.title}</div>
                    <div class="playlist-song-artist">${song.artist}</div>
                </div>
                <div class="playlist-song-duration">${song.duration}</div>
            `;
            
            li.addEventListener('click', () => this.playSong(index));
            this.playlistEl.appendChild(li);
        });
    }

    updatePlaylistHighlight() {
        const items = this.playlistEl.querySelectorAll('li');
        items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
    }

    addSongToPlaylist(songData) {
        const newSong = {
            id: Date.now(),
            title: songData.title || 'Unknown Title',
            artist: songData.artist || 'Unknown Artist',
            album: songData.album || 'Unknown Album',
            duration: songData.duration || '0:00',
            url: songData.url
        };
        
        this.playlist.push(newSong);
        this.renderPlaylist();
        this.updateStatus(`Added: ${newSong.title}`);
        
        // If this is the first song, play it
        if (this.playlist.length === 1 && this.currentIndex === -1) {
            this.playSong(0);
        }
    }

    clearPlaylist() {
        if (this.playlist.length === 0) return;
        
        if (confirm('Are you sure you want to clear the playlist?')) {
            this.playlist = [];
            this.currentIndex = -1;
            this.pause();
            this.audio.src = '';
            this.songTitle.textContent = 'No song selected';
            this.songArtist.textContent = '--';
            this.songAlbum.textContent = '--';
            this.progressFill.style.width = '0%';
            this.currentTimeEl.textContent = '0:00';
            this.totalTimeEl.textContent = '0:00';
            this.renderPlaylist();
            this.updateStatus('Playlist cleared');
        }
    }

    // File Upload
    showUploadSection() {
        this.uploadSection.style.display = 'block';
    }

    hideUploadSection() {
        this.uploadSection.style.display = 'none';
        this.uploadProgress.style.display = 'none';
        this.fileInput.value = '';
    }

    handleFileSelect(e) {
        const files = e.target.files;
        if (files.length > 0) {
            this.handleFiles(files);
        }
    }

    handleFiles(files) {
        this.uploadProgress.style.display = 'block';
        
        Array.from(files).forEach((file, index) => {
            if (!file.type.startsWith('audio/')) {
                this.updateStatus(`Skipped non-audio file: ${file.name}`);
                return;
            }
            
            this.uploadFileName.textContent = file.name;
            
            // Simulate upload progress (in real app, this would upload to server)
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                this.uploadProgressFill.style.width = `${progress}%`;
                this.uploadPercent.textContent = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    
                    // Create object URL for local playback
                    const url = URL.createObjectURL(file);
                    
                    // Extract metadata from filename
                    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                    const parts = fileName.split(' - ');
                    
                    const songData = {
                        title: parts.length > 1 ? parts[1] : fileName,
                        artist: parts.length > 1 ? parts[0] : 'Unknown Artist',
                        album: 'Uploaded Music',
                        duration: '0:00', // Would need to extract actual duration
                        url: url
                    };
                    
                    this.addSongToPlaylist(songData);
                    
                    // If this is the last file, hide upload section
                    if (index === files.length - 1) {
                        setTimeout(() => {
                            this.hideUploadSection();
                        }, 1000);
                    }
                }
            }, 100);
        });
    }

    // Event Handlers
    onSongEnd() {
        if (this.isRepeat) {
            this.audio.currentTime = 0;
            this.play();
        } else {
            this.playNext();
        }
    }

    onAudioError(e) {
        console.error('Audio error:', e);
        this.updateStatus('Error playing audio file');
        this.pause();
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch(e.key.toLowerCase()) {
            case ' ':
                e.preventDefault();
                this.togglePlay();
                break;
            case 'arrowleft':
                e.preventDefault();
                this.playPrevious();
                break;
            case 'arrowright':
                e.preventDefault();
                this.playNext();
                break;
            case 'm':
                e.preventDefault();
                this.setVolume(this.volume === 0 ? 0.8 : 0);
                break;
            case 's':
                e.preventDefault();
                this.toggleShuffle();
                break;
            case 'r':
                e.preventDefault();
                this.toggleRepeat();
                break;
            case 'escape':
                this.hideUploadSection();
                break;
        }
    }

    // Status Updates
    updateStatus(message) {
        this.playerStatus.textContent = message;
        console.log(`Player Status: ${message}`);
    }

    getCurrentSong() {
        return this.playlist[this.currentIndex] || { title: 'No song', artist: '', album: '' };
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.musicPlayer = new MusicPlayer();
    
    // Add some helpful tips
    console.log('Music Player Tips:');
    console.log('- Space: Play/Pause');
    console.log('- Arrow Left: Previous song');
    console.log('- Arrow Right: Next song');
    console.log('- M: Mute/Unmute');
    console.log('- S: Toggle shuffle');
    console.log('- R: Toggle repeat');
    console.log('- Escape: Close upload dialog');
});