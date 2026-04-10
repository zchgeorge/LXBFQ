const request = require('supertest');
const fs = require('fs');
const path = require('path');
const MusicServer = require('../src/server');

describe('Music Player Server', () => {
    let server;
    let app;

    beforeAll(() => {
        server = new MusicServer();
        app = server.app;
    });

    afterAll(() => {
        // Clean up test files
        const uploadPath = path.join(__dirname, '../uploads');
        if (fs.existsSync(uploadPath)) {
            const files = fs.readdirSync(uploadPath);
            files.forEach(file => {
                if (file.includes('_test_')) {
                    fs.unlinkSync(path.join(uploadPath, file));
                }
            });
        }
    });

    describe('Health Check', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('status', 'ok');
            expect(response.body).toHaveProperty('service', 'music-player');
            expect(response.body).toHaveProperty('version', '1.0.0');
        });
    });

    describe('Server Info', () => {
        it('should return server information', async () => {
            const response = await request(app)
                .get('/api/info')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('name', 'Music Player Server');
            expect(response.body).toHaveProperty('version', '1.0.0');
            expect(response.body).toHaveProperty('supportedFormats');
            expect(Array.isArray(response.body.supportedFormats)).toBe(true);
        });
    });

    describe('File Listing', () => {
        it('should list uploaded files', async () => {
            const response = await request(app)
                .get('/api/files')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toHaveProperty('success', true);
            expect(response.body).toHaveProperty('count');
            expect(response.body).toHaveProperty('files');
            expect(Array.isArray(response.body.files)).toBe(true);
        });
    });

    describe('Static File Serving', () => {
        it('should serve index.html', async () => {
            await request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200);
        });

        it('should serve CSS files', async () => {
            await request(app)
                .get('/style.css')
                .expect('Content-Type', /css/)
                .expect(200);
        });

        it('should serve JavaScript files', async () => {
            await request(app)
                .get('/script.js')
                .expect('Content-Type', /javascript/)
                .expect(200);
        });
    });

    describe('Error Handling', () => {
        it('should return 404 for unknown routes', async () => {
            const response = await request(app)
                .get('/api/nonexistent')
                .expect('Content-Type', /json/)
                .expect(404);

            expect(response.body).toHaveProperty('success', false);
            expect(response.body).toHaveProperty('error', 'Endpoint not found');
        });
    });
});

describe('Music Player Client Tests', () => {
    // These would be browser-based tests
    // For now, we'll document what should be tested
    
    test('Player should initialize correctly', () => {
        // Test would check if:
        // 1. Audio element is created
        // 2. Event listeners are attached
        // 3. Default state is correct
        expect(true).toBe(true); // Placeholder
    });

    test('Play/pause functionality', () => {
        // Test would check:
        // 1. Play button toggles play state
        // 2. Audio element play/pause methods are called
        // 3. UI updates correctly
        expect(true).toBe(true); // Placeholder
    });

    test('Volume control', () => {
        // Test would check:
        // 1. Volume slider updates audio volume
        // 2. Volume icon changes based on level
        // 3. Mute functionality works
        expect(true).toBe(true); // Placeholder
    });

    test('Playlist management', () => {
        // Test would check:
        // 1. Songs can be added to playlist
        // 2. Playlist renders correctly
        // 3. Song selection works
        // 4. Clear playlist works
        expect(true).toBe(true); // Placeholder
    });

    test('Progress bar functionality', () => {
        // Test would check:
        // 1. Progress updates during playback
        // 2. Clicking on progress bar seeks to position
        // 3. Time display updates correctly
        expect(true).toBe(true); // Placeholder
    });
});