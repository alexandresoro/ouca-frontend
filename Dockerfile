FROM node:lts as node

WORKDIR /app/basenaturaliste-frontend

COPY basenaturaliste-model/ /app/basenaturaliste-model/
COPY basenaturaliste-frontend/package.json basenaturaliste-frontend/tsconfig.aot.json basenaturaliste-frontend/yarn.lock basenaturaliste-frontend/.yarnrc /app/basenaturaliste-frontend/

RUN yarn install

COPY basenaturaliste-frontend/webpack.aot.config.js /app/basenaturaliste-frontend/
COPY basenaturaliste-frontend/src/ /app/basenaturaliste-frontend/src

RUN yarn build:aot --backend-host=${BACKEND_HOST} --backend-port=${BACKEND_PORT}

FROM nginx:alpine

COPY basenaturaliste-frontend/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=node /app/basenaturaliste-frontend/dist /usr/share/nginx/html

# Used because the nginx frontend acts as a reverse proxy to the backend
EXPOSE 4000