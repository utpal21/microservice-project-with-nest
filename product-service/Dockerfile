FROM node:20-alpine

WORKDIR /app

# Copy package.json & package-lock.json first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Add node_modules/.bin to PATH
ENV PATH=/app/node_modules/.bin:$PATH

# Delete old dist before running
RUN rm -rf dist

# Default command
CMD ["npm", "run", "start:dev"]
