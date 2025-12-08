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

# Install wget for health checks and create non-root user
RUN apk add --no-cache wget && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from build stage (read+execute only, no write for security)
# node_modules don't need write access at runtime - packages are already installed
COPY --from=build --chown=nodejs:nodejs --chmod=555 /app/node_modules ./node_modules

# Copy only necessary source files (explicit paths prevent copying sensitive data)
# Copy server.js and src/ directory (server.js now requires modules from src/)
# Set read-only permissions for security (no write/execute needed - Node.js interprets, not executes)
COPY --chown=nodejs:nodejs --chmod=444 server.js ./
COPY --chown=nodejs:nodejs --chmod=555 src/ ./src/

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5002/health || exit 1

# Expose port (internal container port - not exposed to host)
EXPOSE 5002

# Run application
CMD ["node", "server.js"]

