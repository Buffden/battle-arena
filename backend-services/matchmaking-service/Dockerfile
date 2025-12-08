# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use --ignore-scripts to prevent execution of arbitrary scripts from packages (security)
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Stage 2: Runtime
FROM node:20-alpine
WORKDIR /app

# Install wget for health checks
RUN apk add --no-cache wget

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from build stage (read+execute only, no write for security)
# node_modules don't need write access at runtime - packages are already installed
# chmod=555 = r-xr-xr-x (read+execute, no write permissions) - prevents modification at runtime
COPY --from=build --chown=nodejs:nodejs --chmod=555 /app/node_modules ./node_modules

# Copy only necessary source files (explicit paths prevent copying sensitive data)
# Copy server.js and src/ directory
# Security: Files set to read-only (444 = r--r--r--), no write permissions
# Directories set to read+execute (555 = r-xr-xr-x), no write permissions
# This prevents modification of source files at runtime
COPY --chown=nodejs:nodejs --chmod=444 server.js ./
COPY --chown=nodejs:nodejs --chmod=555 src/ ./src/

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/health || exit 1

# Expose port (internal container port - not exposed to host)
EXPOSE 3002

# Run application
CMD ["node", "server.js"]

