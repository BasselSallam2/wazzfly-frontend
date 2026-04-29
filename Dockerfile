# syntax=docker/dockerfile:1.7

# ---------- Build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# NODE_ENV=production before npm ci omits devDependencies (tsc/vite); set it only on build.
COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN NODE_ENV=production npm run build

# ---------- Runtime stage ----------
FROM nginx:1.27-alpine AS runtime

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
