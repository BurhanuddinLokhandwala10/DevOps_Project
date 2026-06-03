# Use lightweight alpine Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package dependencies and install (exclude dev dependencies for production-like size)
COPY package.json ./
RUN npm install --only=production

# Copy application files
COPY server.js ./

# Expose service port
EXPOSE 5002

# Run application
CMD ["npm", "start"]
