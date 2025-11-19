# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY angular.json tsconfig*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY public ./public

# Build the Angular application
RUN npm run build

# Stage 2: Runtime - Serve static files with nginx
FROM nginx:alpine

# Copy built assets from build stage
# Angular 17+ outputs to dist/[project-name]/browser by default
COPY --from=build /app/dist/frontend-service/browser /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
RUN echo 'server { \
    listen 4200; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:4200 || exit 1

# Expose port (internal container port - not exposed to host)
EXPOSE 4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

