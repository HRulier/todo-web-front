# Base
FROM node:lts-alpine AS base

WORKDIR /app
COPY package*.json ./

# Development
FROM base AS development
RUN npm install
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]

# Builder
FROM base AS builder
RUN npm ci
COPY . .
RUN npm run build

# Production
FROM nginx:alpine AS production

RUN addgroup --system --gid 1001 nginx-group
RUN adduser --system --uid 1001 --ingroup nginx-group nginx-user

# Configuration nginx pour SPA
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 5173;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Handle SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2?)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

COPY --from=builder --chown=nginx-user:nginx-group /app/dist /usr/share/nginx/html

RUN chown -R nginx-user:nginx-group /var/cache/nginx && \
    chown -R nginx-user:nginx-group /var/log/nginx && \
    chown -R nginx-user:nginx-group /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown nginx-user:nginx-group /var/run/nginx.pid

USER nginx-user

EXPOSE 5173

CMD ["nginx", "-g", "daemon off;"]

