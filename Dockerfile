# SharePoint Framework Development Environment with Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /usr/app/spfx

# Install required tools for SharePoint Framework and React
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    bash \
    curl \
    && npm install -g @microsoft/generator-sharepoint@1.18.2 gulp-cli@2.3.0 yo@4.3.1

# Create non-root user for development
RUN addgroup -g 1001 spfx && adduser -D -s /bin/bash -G spfx -u 1001 spfx

# Set ownership and permissions for working directory
RUN mkdir -p /usr/app/spfx && chown -R spfx:spfx /usr/app/spfx

# Switch to non-root user
USER spfx

# Copy package files first for better layer caching
COPY --chown=spfx:spfx package*.json ./

# Install dependencies
RUN npm install && npm cache clean --force

# Copy source code (excluding node_modules due to .dockerignore)
COPY --chown=spfx:spfx . .

# Create necessary directories
RUN mkdir -p temp lib dist

# Expose ports for development server and live reload
EXPOSE 4321 35729

# Health check to ensure the dev server is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:4321 || exit 1

# Default command for development
CMD ["npm", "run", "serve"]
