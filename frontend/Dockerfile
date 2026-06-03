# Use lightweight alpine Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package dependencies and install
COPY package.json ./
RUN npm install --only=production

# Copy application files
COPY server.js ./
COPY public/ ./public/

# Expose server port
EXPOSE 5000

# Set production environment defaults
ENV PORT=5000

# Run application
CMD ["npm", "start"]
