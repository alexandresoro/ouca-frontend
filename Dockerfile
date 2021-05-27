# 1. Transpile the project
FROM node:14-alpine as node

WORKDIR /app/frontend

RUN apk add git

COPY ./ /app/frontend/

RUN git submodule init
RUN git submodule update

RUN npm ci
RUN npm run build

# 2. Build the webserver image along with the built project
FROM caddy

COPY docker/Caddyfile /etc/caddy/Caddyfile
COPY --from=node /app/frontend/dist /srv

ENV DOMAIN_URL http://localhost
ENV BACKEND_HOST backend
ENV BACKEND_PORT 4000

EXPOSE 80
EXPOSE 443