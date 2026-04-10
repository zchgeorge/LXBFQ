const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

class MusicServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.uploadPath = path.join(__dirname, '../uploads');
        
        this.setupUploadDirectory();
        this.configureMiddleware();
        this.configureRoutes();
        this.configureErrorHandling();
    }

    setupUploadDirectory() {
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(this.uploadPath)) {
            fs.mkdirSync(this.uploadPath, { recursive: true });
            console.log(`Created upload directory: ${this.uploadPath}`);
        }
    }

    configureMiddleware() {
        // CORS for cross-origin requests
        this.app.use(cors());
        
        // Parse JSON bodies
        this.app.use(express.json());
        
        // Serve static files from public directory
        this.app.use(express.static(path.join(__dirname, '../public')));
        
        // Serve uploaded files
        this.app.use('/uploads', express.static(this.uploadPath));
        
        // Logging middleware
        this.app.use((req, res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
            next();
        });
    }

    configureRoutes() {
        // Health check endpoint
        this.app.get('/api/health', (req, res) => {
            res.json({
                status: 'ok',
                service: 'music-player',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            });
        });

        // Get server info
        this.app.get('/api/info', (req, res) => {
            res.json({
                name: 'Music Player Server',
                version: '1.0.0',
                uploadPath: this.uploadPath,
                maxFileSize: '50MB',
                supportedFormats: ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac']
            });
        });

        // List uploaded files
        this.app.get('/api/files', (req, res) => {
            try {
                const files = fs.readdirSync(this.uploadPath)
                    .filter(file => {
                        const ext = path.extname(file).toLowerCase();
                        return ['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'].includes(ext);
                    })
                    .map(file => {
                        const filePath = path.join(this.uploadPath, file);
                        const stats = fs.statSync(filePath);
                        
                        return {
                            name: file,
                            path: `/uploads/${file}`,
                            size: stats.size,
                            modified: stats.mtime,
                            type: path.extname(file).toLowerCase().replace('.', '')
                        };
                    });
                
                res.json({
                    success: true,
                    count: files.length,
                    files: files
                });
            } catch (error) {
                console.error('Error listing files:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to list files'
                });
            }
        });

        // Configure file upload
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadPath);
            },
            filename: (req, file, cb) => {
                // Sanitize filename and add timestamp
                const originalName = path.parse(file.originalname).name;
                const sanitizedName = originalName.replace(/[^a-zA-Z0-9-_]/g, '_');
                const timestamp = Date.now();
                const extension = path.extname(file.originalname).toLowerCase();
                cb(null, `${sanitizedName}_${timestamp}${extension}`);
            }
        });

        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB limit
                files: 10 // Max 10 files per request
            },
            fileFilter: (req, file, cb) => {
                const allowedTypes = [
                    'audio/mpeg',
                    'audio/wav',
                    'audio/ogg',
                    'audio/flac',
                    'audio/x-m4a',
                    'audio/aac'
                ];
                
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only audio files are allowed.'));
                }
            }
        });

        // File upload endpoint
        this.app.post('/api/upload', upload.array('musicFiles', 10), (req, res) => {
            try {
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'No files uploaded'
                    });
                }

                const uploadedFiles = req.files.map(file => ({
                    name: file.originalname,
                    savedName: file.filename,
                    path: `/uploads/${file.filename}`,
                    size: file.size,
                    mimetype: file.mimetype
                }));

                console.log(`Uploaded ${uploadedFiles.length} file(s)`);
                
                res.json({
                    success: true,
                    message: `Successfully uploaded ${uploadedFiles.length} file(s)`,
                    files: uploadedFiles
                });
            } catch (error) {
                console.error('Upload error:', error);
                res.status(500).json({
                    success: false,
                    error: error.message || 'Upload failed'
                });
            }
        });

        // Delete file endpoint
        this.app.delete('/api/files/:filename', (req, res) => {
            try {
                const filename = req.params.filename;
                const filePath = path.join(this.uploadPath, filename);
                
                if (!fs.existsSync(filePath)) {
                    return res.status(404).json({
                        success: false,
                        error: 'File not found'
                    });
                }
                
                fs.unlinkSync(filePath);
                
                res.json({
                    success: true,
                    message: `File ${filename} deleted successfully`
                });
            } catch (error) {
                console.error('Delete error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Failed to delete file'
                });
            }
        });

        // Serve main page for all other routes (SPA support)
        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
    }

    configureErrorHandling() {
        // 404 handler
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                error: 'Endpoint not found'
            });
        });

        // Global error handler
        this.app.use((err, req, res, next) => {
            console.error('Server error:', err);
            
            // Multer errors
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        error: 'File too large. Maximum size is 50MB.'
                    });
                }
                if (err.code === 'LIMIT_FILE_COUNT') {
                    return res.status(400).json({
                        success: false,
                        error: 'Too many files. Maximum is 10 files per upload.'
                    });
                }
            }
            
            res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        });
    }

    start() {
        this.server = this.app.listen(this.port, () => {
            console.log(`🎵 Music Player Server running on port ${this.port}`);
            console.log(`📁 Public URL: http://localhost:${this.port}`);
            console.log(`📁 Upload directory: ${this.uploadPath}`);
            console.log(`📁 Health check: http://localhost:${this.port}/api/health`);
            console.log('🚀 Ready to play music!');
        });

        // Graceful shutdown
        process.on('SIGTERM', () => this.shutdown());
        process.on('SIGINT', () => this.shutdown());
    }

    shutdown() {
        console.log('Shutting down Music Player Server...');
        if (this.server) {
            this.server.close(() => {
                console.log('Server closed');
                process.exit(0);
            });
        }
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const server = new MusicServer();
    server.start();
}

module.exports = MusicServer;