#!/bin/bash

# Battle Arena - Development Restart Script
# Restarts all services using Docker Compose

set -e

echo "=========================================="
echo "Restarting Battle Arena Development Environment"
echo "=========================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running. Please start Docker and try again."
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

# Change to project root directory
cd "$PROJECT_ROOT"

# Restart services
echo "Restarting services..."
$COMPOSE_CMD restart

echo ""
echo "Waiting for services to be healthy..."
sleep 5

# Check service status
echo ""
echo "Service Status:"
$COMPOSE_CMD ps

echo ""
echo "=========================================="
echo "Services restarted successfully!"
echo "=========================================="
echo ""
echo "Access points:"
echo "  - API Gateway: http://localhost"
echo "  - Health Check: http://localhost/health"
echo ""
echo "To view logs: $COMPOSE_CMD logs -f"
echo ""

