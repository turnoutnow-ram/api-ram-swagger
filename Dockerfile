# Use official Node.js runtime as base image
# Using Alpine version for smaller image size
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app


# Copy package.json and package-lock.json (if available)
# This is done before copying the entire codebase to leverage Docker layer caching
COPY package*.json ./

# Install dependencies
# Using npm ci for faster, reliable, reproducible builds
RUN npm ci --only=production && npm cache clean --force

# Create a non-root user to run the application (security best practice)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy the rest of the application code
COPY . .

# Generate Swagger documentation
RUN npm run swagger

# Change ownership of the app directory to the nodejs user
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to the non-root user
USER nodejs

# Expose the port that the app runs on
EXPOSE 3000 
 
# Define the command to run the application
CMD ["npm", "start"]
