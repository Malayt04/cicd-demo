# Build stage
FROM node:20-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy app source
COPY . .

# Production stage
FROM gcr.io/distroless/nodejs20-debian12

# Create app directory
WORKDIR /usr/src/app

# Copy built application from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/index.js ./
COPY --from=builder /usr/src/app/package.json ./

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["index.js"] 