# ========================
# 1. Build React app
# ========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json trước để cache npm install
COPY package*.json ./
RUN npm install

# Copy toàn bộ source
COPY . .

# Build production
RUN npm run build


# ========================
# 2. Serve bằng Nginx
# ========================
FROM nginx:alpine

# Copy build output sang nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Cấu hình nginx cho SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
