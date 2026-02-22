# Base image for common dependencies
FROM node:24-alpine AS common-deps

WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY ./package.json ./yarn.lock ./.yarnrc.yml ./tsconfig.base.json ./nx.json /app/
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches

COPY ./packages/clientvault-emails/package.json /app/packages/clientvault-emails/
COPY ./packages/clientvault-server/package.json /app/packages/clientvault-server/
COPY ./packages/clientvault-server/patches /app/packages/clientvault-server/patches
COPY ./packages/clientvault-ui/package.json /app/packages/clientvault-ui/
COPY ./packages/clientvault-shared/package.json /app/packages/clientvault-shared/
COPY ./packages/clientvault-front/package.json /app/packages/clientvault-front/
COPY ./packages/clientvault-sdk/package.json /app/packages/clientvault-sdk/

# Install all dependencies
RUN yarn && yarn cache clean && npx nx reset


# Build the back
FROM common-deps AS clientvault-server-build

# Copy sourcecode after installing dependences to accelerate subsequents builds
COPY ./packages/clientvault-emails /app/packages/clientvault-emails
COPY ./packages/clientvault-shared /app/packages/clientvault-shared
COPY ./packages/clientvault-server /app/packages/clientvault-server

RUN npx nx run clientvault-server:build

RUN yarn workspaces focus --production clientvault-emails clientvault-shared clientvault-server

# Build the front
FROM common-deps AS clientvault-front-build

ARG REACT_APP_SERVER_BASE_URL

COPY ./packages/clientvault-front /app/packages/clientvault-front
COPY ./packages/clientvault-ui /app/packages/clientvault-ui
COPY ./packages/clientvault-shared /app/packages/clientvault-shared
COPY ./packages/clientvault-sdk /app/packages/clientvault-sdk
RUN npx nx build clientvault-front


# Final stage: Run the application
FROM node:24-alpine AS clientvault

# Used to run healthcheck in docker
RUN apk add --no-cache curl jq

RUN npm install -g tsx

RUN apk add --no-cache postgresql-client

COPY ./packages/clientvault-docker/clientvault/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
WORKDIR /app/packages/clientvault-server

ARG REACT_APP_SERVER_BASE_URL
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION

# Copy built applications from previous stages
COPY --chown=1000 --from=clientvault-server-build /app /app
COPY --chown=1000 --from=clientvault-server-build /app/packages/clientvault-server /app/packages/clientvault-server
COPY --chown=1000 --from=clientvault-front-build /app/packages/clientvault-front/build /app/packages/clientvault-server/dist/front

# Set metadata and labels
LABEL org.opencontainers.image.source=https://github.com/clientvaulthq/clientvault
LABEL org.opencontainers.image.description="This image provides a consistent and reproducible environment for the backend and frontend, ensuring it deploys faster and runs the same way regardless of the deployment environment."

RUN mkdir -p /app/.local-storage /app/packages/clientvault-server/.local-storage && \
    chown -R 1000:1000 /app

# Use non root user with uid 1000
USER 1000

CMD ["node", "dist/main"]
ENTRYPOINT ["/app/entrypoint.sh"]
