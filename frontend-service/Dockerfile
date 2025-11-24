# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY angular.json tsconfig*.json ./

# Install dependencies
# Use --ignore-scripts to prevent execution of arbitrary scripts from packages (security)
RUN npm ci --ignore-scripts

# Copy source code
COPY src ./src
COPY public ./public

# Build the Angular application
RUN npm run build

# Stage 2: Runtime - Serve static files with nginx
FROM nginx:alpine

# Security Note: Nginx runs as root by default in nginx:alpine image
# This is acceptable here because:
# - Only serving static files (no user-uploaded content)
# - Running in isolated container environment
# - Static assets are read-only (no write operations needed)
# - Nginx master process runs as root, worker processes drop privileges automatically

# Copy built assets from build stage (read+execute only, no write for security)
# Angular 17+ outputs to dist/[project-name]/browser by default
# Set read+execute permissions (no write) - directories need execute to be traversed
COPY --from=build --chmod=555 /app/dist/frontend-service/browser /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing (read-only for security)
# nginx.conf doesn't need execute permission, only read
COPY --chmod=444 nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:80 || exit 1

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

