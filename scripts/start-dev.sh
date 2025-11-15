#!/bin/bash

# Battle Arena - Development Startup Script
# Starts all services using Docker Compose

set -e

echo "Starting Battle Arena Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1 && ! docker compose version > /dev/null 2>&1; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Determine which compose command to use
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
else
    COMPOSE_CMD="docker-compose"
fi

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "Project root: $PROJECT_ROOT"
echo ""

# Change to project root directory
cd "$PROJECT_ROOT"

# Start services in detached mode
echo "Starting services..."
$COMPOSE_CMD up -d

echo ""
echo "Waiting for services to be healthy..."
sleep 5

# Check service status
echo ""
echo "Service Status:"
$COMPOSE_CMD ps

echo ""
echo "Services started successfully!"
echo ""
echo "Access points:"
echo "  - API Gateway: http://localhost"
echo "  - Health Check: http://localhost/health"
echo "  - MongoDB: localhost:27017"
echo "  - Redis: localhost:6379"
echo ""
echo "To view logs: $COMPOSE_CMD logs -f"
echo "To stop services: ./scripts/stop-dev.sh"
echo ""

