# Dockerfile for building MidiShuffle React application

# Stage 1: Build the React application with Vite
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build the application with Vite (outputs to /app/dist)
RUN npm run build

# Stage 2: Create the production image with NGINX
FROM nginx:alpine

# Remove all default configurations
RUN rm -rf /etc/nginx/conf.d/*

# Copy the custom NGINX configuration
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]