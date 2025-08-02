FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Use NODE_ENV=development only during npm install
RUN NODE_ENV=development npm install --legacy-peer-deps

COPY . .

ENV PATH=/app/node_modules/.bin:$PATH

CMD ["npm", "run", "start:dev"]
