# Scripts

Helper scripts for setup, deployment, and other tasks.

## Development Scripts

### start-dev.sh
Starts all services using Docker Compose.

**Usage:**
```bash
./scripts/start-dev.sh
```

**What it does:**
- Checks if Docker is running
- Checks if Docker Compose is available
- Starts all services in detached mode
- Displays service status
- Shows access points

### stop-dev.sh
Stops all services using Docker Compose.

**Usage:**
```bash
./scripts/stop-dev.sh
```

**What it does:**
- Stops all running services
- Preserves volumes (data persists)
- Shows helpful messages

**Note:** To remove volumes, use `docker-compose down -v` manually.

### restart-dev.sh
Restarts all services using Docker Compose.

**Usage:**
```bash
./scripts/restart-dev.sh
```

**What it does:**
- Restarts all running services
- Waits for services to be healthy
- Displays service status

## Prerequisites

- Docker installed and running
- Docker Compose installed (V1 or V2)
- docker-compose.yml in project root

## Scripts Location

All scripts are located in the `scripts/` directory and are executable.
