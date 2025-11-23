# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code and configuration files
COPY angular.json tsconfig*.json ./
COPY src ./src
COPY public ./public

# Build Angular application for production
RUN npm run build -- --configuration production

# Stage 2: Runtime with Nginx
FROM nginx:1.25-alpine

# Install wget for health checks
RUN apk add --no-cache wget

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular application from build stage
# Angular 20 outputs to dist/<project-name>/browser where project-name is from angular.json
# For project root "", it's typically dist/frontend-service/browser
COPY --from=build /app/dist/frontend-service/browser /usr/share/nginx/html

# Create nginx cache directories and set permissions
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx /var/log/nginx /var/run /etc/nginx/conf.d

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Expose port 80 (nginx default)
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

