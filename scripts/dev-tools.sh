#!/bin/bash

# Battle Arena - Development Tools Script
# Comprehensive scripts for common development tasks

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Run all tests
test-all() {
    print_info "Running all tests..."
    cd "$PROJECT_ROOT"
    
    # Java services
    print_info "Testing Java services..."
    for service in auth-service profile-service leaderboard-service; do
        if [ -d "backend-services/$service" ]; then
            print_info "Testing $service..."
            cd "backend-services/$service"
            mvn test || print_warning "$service tests failed or require external services"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Node.js services
    print_info "Testing Node.js services..."
    for service in matchmaking-service game-engine; do
        if [ -d "backend-services/$service" ]; then
            print_info "Testing $service..."
            cd "backend-services/$service"
            npm run test:ci 2>/dev/null || npm run test 2>/dev/null || print_warning "$service tests not configured"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Angular frontend
    if [ -d "frontend-service" ]; then
        print_info "Testing Angular frontend..."
        cd frontend-service
        npm run test 2>/dev/null || print_warning "Frontend tests not configured"
        cd "$PROJECT_ROOT"
    fi
    
    print_info "All tests completed!"
}

# Run all linters
lint-all() {
    print_info "Running all linters..."
    cd "$PROJECT_ROOT"
    
    # Java services
    print_info "Linting Java services..."
    for service in auth-service profile-service leaderboard-service; do
        if [ -d "backend-services/$service" ]; then
            print_info "Linting $service..."
            cd "backend-services/$service"
            mvn checkstyle:check || print_warning "$service linting failed"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Node.js services
    print_info "Linting Node.js services..."
    for service in matchmaking-service game-engine; do
        if [ -d "backend-services/$service" ]; then
            print_info "Linting $service..."
            cd "backend-services/$service"
            npm run lint 2>/dev/null || print_warning "$service linting not configured"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Angular frontend
    if [ -d "frontend-service" ]; then
        print_info "Linting Angular frontend..."
        cd frontend-service
        npm run lint 2>/dev/null || print_warning "Frontend linting not configured"
        cd "$PROJECT_ROOT"
    fi
    
    print_info "All linting completed!"
}

# Format all code
format-all() {
    print_info "Formatting all code..."
    cd "$PROJECT_ROOT"
    
    # Node.js services
    print_info "Formatting Node.js services..."
    for service in matchmaking-service game-engine; do
        if [ -d "backend-services/$service" ]; then
            print_info "Formatting $service..."
            cd "backend-services/$service"
            npm run format 2>/dev/null || print_warning "$service formatting not configured"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Angular frontend
    if [ -d "frontend-service" ]; then
        print_info "Formatting Angular frontend..."
        cd frontend-service
        npm run format 2>/dev/null || print_warning "Frontend formatting not configured"
        cd "$PROJECT_ROOT"
    fi
    
    # Format root JSON/MD files
    if command -v npx > /dev/null 2>&1; then
        print_info "Formatting root JSON/MD files..."
        npx prettier --write "*.json" "*.md" 2>/dev/null || print_warning "Prettier not available"
    fi
    
    print_info "All formatting completed!"
}

# Generate coverage reports
coverage-all() {
    print_info "Generating coverage reports..."
    cd "$PROJECT_ROOT"
    
    # Java services
    print_info "Generating coverage for Java services..."
    for service in auth-service profile-service leaderboard-service; do
        if [ -d "backend-services/$service" ]; then
            print_info "Generating coverage for $service..."
            cd "backend-services/$service"
            mvn jacoco:report || print_warning "$service coverage generation failed"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Node.js services
    print_info "Generating coverage for Node.js services..."
    for service in matchmaking-service game-engine; do
        if [ -d "backend-services/$service" ]; then
            print_info "Generating coverage for $service..."
            cd "backend-services/$service"
            npm run test:coverage 2>/dev/null || print_warning "$service coverage not configured"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Angular frontend
    if [ -d "frontend-service" ]; then
        print_info "Generating coverage for Angular frontend..."
        cd frontend-service
        npm run test:coverage 2>/dev/null || print_warning "Frontend coverage not configured"
        cd "$PROJECT_ROOT"
    fi
    
    print_info "All coverage reports generated!"
}

# Build all services
build-all() {
    print_info "Building all services..."
    cd "$PROJECT_ROOT"
    
    # Java services
    print_info "Building Java services..."
    for service in auth-service profile-service leaderboard-service; do
        if [ -d "backend-services/$service" ]; then
            print_info "Building $service..."
            cd "backend-services/$service"
            mvn clean package -DskipTests || print_warning "$service build failed"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Node.js services
    print_info "Building Node.js services..."
    for service in matchmaking-service game-engine; do
        if [ -d "backend-services/$service" ]; then
            print_info "Building $service..."
            cd "backend-services/$service"
            npm run build 2>/dev/null || print_warning "$service build not configured"
            cd "$PROJECT_ROOT"
        fi
    done
    
    # Angular frontend
    if [ -d "frontend-service" ]; then
        print_info "Building Angular frontend..."
        cd frontend-service
        npm run build 2>/dev/null || print_warning "Frontend build not configured"
        cd "$PROJECT_ROOT"
    fi
    
    print_info "All builds completed!"
}

# Show usage
usage() {
    echo "Usage: $0 {test-all|lint-all|format-all|coverage-all|build-all}"
    echo ""
    echo "Commands:"
    echo "  test-all      - Run all tests across all services"
    echo "  lint-all      - Run all linters across all services"
    echo "  format-all    - Format all code across all services"
    echo "  coverage-all  - Generate coverage reports for all services"
    echo "  build-all     - Build all services"
    exit 1
}

# Main
case "${1:-}" in
    test-all)
        test-all
        ;;
    lint-all)
        lint-all
        ;;
    format-all)
        format-all
        ;;
    coverage-all)
        coverage-all
        ;;
    build-all)
        build-all
        ;;
    *)
        usage
        ;;
esac

