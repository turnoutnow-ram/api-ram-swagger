# Use official Node.js runtime as base image
# Using Alpine version for smaller image size
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app


# Copy package.json and package-lock.json (if available)
# This is done before copying the entire codebase to leverage Docker layer caching
COPY package*.json ./

# Install all dependencies first (including dev dependencies for swagger generation)
# Using npm ci for faster, reliable, reproducible builds
RUN npm ci && npm cache clean --force

# Create a non-root user to run the application (security best practice)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy the rest of the application code
COPY . .

# Generate Swagger documentation
RUN npm run swagger

# Generate test  
RUN npm run test
 

# Remove dev dependencies to reduce image size (keep only production dependencies)
RUN npm ci --only=production && npm cache clean --force

# Change ownership of the app directory to the nodejs user
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to the non-root user
USER nodejs

# Expose the port that the app runs on
EXPOSE 3000 

# Add healthcheck to monitor application status
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "const http = require('http'); \
    const options = { hostname: 'localhost', port: process.env.PORT || 3000, path: '/', timeout: 5000 }; \
    const req = http.request(options, (res) => { process.exit(res.statusCode === 200 ? 0 : 1); }); \
    req.on('error', () => process.exit(1)); \
    req.on('timeout', () => process.exit(1)); \
    req.end();"

# Define the command to run the application
CMD ["npm", "start"]
