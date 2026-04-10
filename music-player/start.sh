#!/bin/bash

# Music Player Startup Script
# Usage: ./start.sh [--dev|--test|--prod]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Default mode
MODE="dev"
PORT=3000

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --dev)
            MODE="dev"
            shift
            ;;
        --test)
            MODE="test"
            shift
            ;;
        --prod)
            MODE="prod"
            shift
            ;;
        --port)
            PORT="$2"
            shift 2
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --dev     Development mode (default)"
            echo "  --test    Run tests"
            echo "  --prod    Production mode"
            echo "  --port N  Set server port (default: 3000)"
            echo "  --help    Show this help"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$NODE_MAJOR" -lt 18 ]; then
    print_error "Node.js 18 or higher is required (found v$NODE_VERSION)"
    exit 1
fi
print_success "Node.js v$NODE_VERSION detected"

# Check if in project directory
if [ ! -f "package.json" ]; then
    print_error "Not in music-player project directory"
    print_status "Please run this script from the music-player folder"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "Dependencies installed"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
fi

# Create necessary directories
print_status "Creating directories..."
mkdir -p uploads
mkdir -p logs
print_success "Directories created"

case $MODE in
    "dev")
        print_status "Starting development server on port $PORT..."
        print_status "Press Ctrl+C to stop"
        echo ""
        print_status "Access the player at: http://localhost:$PORT"
        print_status "API health check: http://localhost:$PORT/api/health"
        echo ""
        
        # Start server with nodemon for auto-reload
        NODE_ENV=development PORT=$PORT npx nodemon src/server.js
        ;;
        
    "test")
        print_status "Running tests..."
        npm test
        ;;
        
    "prod")
        print_status "Starting production server on port $PORT..."
        print_status "Press Ctrl+C to stop"
        echo ""
        print_status "Access the player at: http://localhost:$PORT"
        print_status "API health check: http://localhost:$PORT/api/health"
        echo ""
        
        # Start server in production mode
        NODE_ENV=production PORT=$PORT node src/server.js
        ;;
esac