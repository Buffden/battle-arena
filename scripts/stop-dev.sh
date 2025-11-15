#!/bin/bash

# Battle Arena - Development Stop Script
# Stops all services using Docker Compose

set -e
echo "Stopping Battle Arena Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Error: Docker is not running."
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

# Stop services
echo "Stopping services..."
$COMPOSE_CMD down

echo ""
echo "Services stopped successfully!"
echo ""
echo "Note: Volumes are preserved. Data will persist."
echo "To remove volumes: $COMPOSE_CMD down -v"
echo "To start services: ./scripts/start-dev.sh"
echo ""

