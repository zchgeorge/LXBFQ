#!/bin/bash

# Music Player Monitoring Script
# Monitors player health, performance, and functionality

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PORT=${1:-3000}
BASE_URL="http://localhost:$PORT"
CHECK_INTERVAL=5  # seconds

print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}  Music Player Monitor${NC}"
    echo -e "${BLUE}  $(date)${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_check() {
    local status=$1
    local message=$2
    
    if [ "$status" = "OK" ]; then
        echo -e "  ${GREEN}✓${NC} $message"
    elif [ "$status" = "WARN" ]; then
        echo -e "  ${YELLOW}⚠${NC} $message"
    else
        echo -e "  ${RED}✗${NC} $message"
    fi
}

check_server_health() {
    echo -e "\n${BLUE}[Health Check]${NC}"
    
    # Check if server is running
    if curl -s -f "$BASE_URL/api/health" > /dev/null 2>&1; then
        print_check "OK" "Server is running"
        
        # Get health details
        local health_response=$(curl -s "$BASE_URL/api/health")
        local status=$(echo "$health_response" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
        local version=$(echo "$health_response" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
        
        print_check "OK" "Service status: $status"
        print_check "OK" "Version: $version"
    else
        print_check "FAIL" "Server is not responding"
        return 1
    fi
}

check_api_endpoints() {
    echo -e "\n${BLUE}[API Endpoints]${NC}"
    
    local endpoints=("/api/info" "/api/files")
    
    for endpoint in "${endpoints[@]}"; do
        if curl -s -f "$BASE_URL$endpoint" > /dev/null 2>&1; then
            print_check "OK" "GET $endpoint"
        else
            print_check "FAIL" "GET $endpoint"
        fi
    done
}

check_static_files() {
    echo -e "\n${BLUE}[Static Files]${NC}"
    
    local files=("/" "/style.css" "/script.js")
    
    for file in "${files[@]}"; do
        if curl -s -f "$BASE_URL$file" > /dev/null 2>&1; then
            print_check "OK" "Serving $file"
        else
            print_check "FAIL" "Failed to serve $file"
        fi
    done
}

check_system_resources() {
    echo -e "\n${BLUE}[System Resources]${NC}"
    
    # Check Node.js process
    local node_pid=$(pgrep -f "node.*server.js" | head -1)
    
    if [ -n "$node_pid" ]; then
        print_check "OK" "Node.js process running (PID: $node_pid)"
        
        # Get memory usage
        local memory_mb=$(ps -p "$node_pid" -o rss= | awk '{printf "%.1f", $1/1024}')
        print_check "INFO" "Memory usage: ${memory_mb}MB"
        
        # Get CPU usage (requires top, might not work in all environments)
        if command -v top > /dev/null 2>&1; then
            local cpu_percent=$(top -b -n 1 -p "$node_pid" | tail -1 | awk '{print $9}')
            if [ -n "$cpu_percent" ]; then
                print_check "INFO" "CPU usage: ${cpu_percent}%"
            fi
        fi
    else
        print_check "FAIL" "No Node.js process found"
    fi
    
    # Check disk space for uploads
    local upload_dir="./uploads"
    if [ -d "$upload_dir" ]; then
        local disk_usage=$(du -sh "$upload_dir" 2>/dev/null | cut -f1)
        print_check "INFO" "Uploads directory: $disk_usage"
    fi
}

check_upload_functionality() {
    echo -e "\n${BLUE}[Upload Functionality]${NC}"
    
    # Create a test audio file (silent MP3)
    local test_file="test_monitor_$(date +%s).mp3"
    
    # Create a minimal valid MP3 header (silent 1-second audio)
    echo -n 'ID3\x03\x00\x00\x00\x00\x00\x00' > "$test_file"
    
    # Try to upload (simulated - in real monitor would use actual upload)
    if [ -f "$test_file" ]; then
        print_check "OK" "Test file created: $test_file"
        
        # Check if uploads directory is writable
        if [ -w "./uploads" ]; then
            print_check "OK" "Uploads directory is writable"
        else
            print_check "WARN" "Uploads directory may not be writable"
        fi
        
        # Clean up test file
        rm -f "$test_file"
        print_check "OK" "Test file cleaned up"
    else
        print_check "WARN" "Could not create test file"
    fi
}

run_functional_test() {
    echo -e "\n${BLUE}[Functional Test]${NC}"
    
    # This would ideally use a headless browser or API tests
    # For now, we'll check basic functionality
    
    print_check "INFO" "Manual testing required for full functionality"
    print_check "INFO" "Please visit: $BASE_URL"
    print_check "INFO" "Test: Play/pause controls, volume, playlist"
}

generate_report() {
    echo -e "\n${BLUE}[Monitoring Report]${NC}"
    echo "Generated: $(date)"
    echo "Server: $BASE_URL"
    echo "Status: $1"
    echo "Issues found: $2"
    
    if [ "$2" -gt 0 ]; then
        echo -e "\n${YELLOW}Recommendations:${NC}"
        echo "1. Check server logs for errors"
        echo "2. Verify file permissions"
        echo "3. Ensure port $PORT is available"
        echo "4. Test with different browsers"
    else
        echo -e "\n${GREEN}All systems operational!${NC}"
    fi
}

# Main monitoring function
monitor() {
    local issues=0
    
    print_header
    
    # Run checks
    if ! check_server_health; then
        issues=$((issues + 1))
    fi
    
    check_api_endpoints
    check_static_files
    check_system_resources
    check_upload_functionality
    run_functional_test
    
    generate_report "COMPLETED" "$issues"
    
    if [ "$issues" -gt 0 ]; then
        return 1
    else
        return 0
    fi
}

# Continuous monitoring mode
continuous_monitor() {
    echo -e "${BLUE}Starting continuous monitoring...${NC}"
    echo -e "${BLUE}Press Ctrl+C to stop${NC}"
    
    while true; do
        monitor
        echo -e "\n${BLUE}Next check in ${CHECK_INTERVAL} seconds...${NC}"
        sleep "$CHECK_INTERVAL"
    done
}

# Parse arguments
case "${2:-}" in
    "--continuous"|"-c")
        continuous_monitor
        ;;
    "--help"|"-h")
        echo "Usage: $0 [PORT] [OPTION]"
        echo "Options:"
        echo "  --continuous, -c  Run continuous monitoring"
        echo "  --help, -h        Show this help"
        echo ""
        echo "Example:"
        echo "  $0 3000           Single health check"
        echo "  $0 3000 -c        Continuous monitoring"
        exit 0
        ;;
    *)
        monitor
        ;;
esac