FROM node:20-alpine

WORKDIR /app

# Copy package.json trước
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "server.js"]
