# Build stage
FROM node:22-alpine AS build

WORKDIR /app

COPY frontend/cafe-front/package*.json ./
RUN npm ci

COPY frontend/cafe-front ./
COPY docker.env /tmp/docker.env

RUN set -a \
    && . /tmp/docker.env \
    && set +a \
    && npm run build \
    && rm /tmp/docker.env

# Production stage
FROM nginx:1.29-alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
