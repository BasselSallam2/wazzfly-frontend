# syntax=docker/dockerfile:1.7

# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# NODE_ENV=production before npm ci omits devDependencies (tsc/vite); set it only on build.
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Vite inlines import.meta.env at compile time.
# Override via Coolify "Build Variables" / `docker compose build --build-arg ...` /
# `docker build --build-arg VITE_API_BASE_URL=https://api.example/api ...`
ARG VITE_API_BASE_URL=http://localhost:3000/api
ARG VITE_SOCKET_URL=http://localhost:3000
ARG VITE_SOCKET_PATH=/socket.io
ARG VITE_APP_NAME=Wazzfly Admin
ARG VITE_DEFAULT_CURRENCY=USD
ARG VITE_ENABLE_ADMIN_PROJECT_CREATE=false
ARG VITE_NOTIFICATIONS_POLL_MS=30000
ARG VITE_DASHBOARD_REFRESH_MS=60000
ARG VITE_SENTRY_DSN=

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_SOCKET_URL=${VITE_SOCKET_URL}
ENV VITE_SOCKET_PATH=${VITE_SOCKET_PATH}
ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_DEFAULT_CURRENCY=${VITE_DEFAULT_CURRENCY}
ENV VITE_ENABLE_ADMIN_PROJECT_CREATE=${VITE_ENABLE_ADMIN_PROJECT_CREATE}
ENV VITE_NOTIFICATIONS_POLL_MS=${VITE_NOTIFICATIONS_POLL_MS}
ENV VITE_DASHBOARD_REFRESH_MS=${VITE_DASHBOARD_REFRESH_MS}
ENV VITE_SENTRY_DSN=${VITE_SENTRY_DSN}

RUN NODE_ENV=production npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

# Matches common PaaS defaults (e.g. Coolify) — map proxy to container port 3000.
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
