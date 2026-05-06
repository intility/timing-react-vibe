# syntax=docker/dockerfile:1
FROM node@sha256:d8e448a56fc63242f70026718378bd4b00f8c82e78d20eefb199224a4d8e33d8 AS build
# lts-slim
WORKDIR /src

# .npmrc is checked in and points at the Intility registry. Append the
# token line at build time so npm ci can authenticate without leaking
# the token into a layer.
COPY ./package.json package-lock.json .npmrc ./

# Configure npm to read the environment variable NODE_AUTH_TOKEN when authenticating to the registry
RUN echo "//npm.intility.com/:_authToken=\${NODE_AUTH_TOKEN}" >> .npmrc

# Mount the secret with id NODE_AUTH_TOKEN to the environment variable NODE_AUTH_TOKEN during npm ci
RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
    npm ci

COPY . .
RUN npm run build

# Runtime: Intility's nginx-unprivileged-react base image. SPA-aware
# (try_files $uri /index.html) so client-side routes resolve under
# react-router. Listens on 8080. SHA-pinned to 2.5.1.
FROM ghcr.io/intility/nginx-unprivileged-react@sha256:0e071176f68f689bd8b7fbdc30062af2b20f935e85c5a7daadec156c0277ea04
COPY --from=build /src/dist /usr/share/nginx/html
EXPOSE 8080
