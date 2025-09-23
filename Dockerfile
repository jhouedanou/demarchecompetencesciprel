# SharePoint Framework Development Environment with Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /usr/app/spfx

# Install required tools
RUN apk add --no-cache git python3 make g++ \
    && npm install -g @microsoft/generator-sharepoint gulp-cli yo

# Create non-root user for development
RUN addgroup spfx && adduser -D -s /bin/sh -G spfx spfx

# Set ownership and permissions
RUN chown -R spfx:spfx /usr/app/spfx

# Switch to non-root user
USER spfx

# Copy package files
COPY --chown=spfx:spfx package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY --chown=spfx:spfx . .

# Expose ports for development server and live reload
EXPOSE 4321 35729

# Default command
CMD ["npm", "run", "serve"]