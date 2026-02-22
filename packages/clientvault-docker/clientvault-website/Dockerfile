FROM node:24-alpine AS clientvault-website-build


WORKDIR /app

COPY ./package.json .
COPY ./yarn.lock .
COPY ./.yarnrc.yml .
COPY ./.yarn/releases /app/.yarn/releases
COPY ./.yarn/patches /app/.yarn/patches
COPY ./packages/clientvault-eslint-rules /app/packages/clientvault-eslint-rules
COPY ./packages/clientvault-ui/package.json /app/packages/clientvault-ui/
COPY ./packages/clientvault-shared/package.json /app/packages/clientvault-shared/
COPY ./packages/clientvault-website/package.json /app/packages/clientvault-website/package.json

RUN yarn

ENV KEYSTATIC_GITHUB_CLIENT_ID="<fake build value>"
ENV KEYSTATIC_GITHUB_CLIENT_SECRET="<fake build value>"
ENV KEYSTATIC_SECRET="<fake build value>"
ENV NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG="<fake build value>"

COPY ./packages/clientvault-ui /app/packages/clientvault-ui
COPY ./packages/clientvault-website /app/packages/clientvault-website
RUN npx nx build clientvault-website

FROM node:24-alpine AS clientvault-website

WORKDIR /app/packages/clientvault-website

COPY --from=clientvault-website-build /app /app

WORKDIR /app/packages/clientvault-website

LABEL org.opencontainers.image.source=https://github.com/clientvaulthq/clientvault
LABEL org.opencontainers.image.description="This image provides a consistent and reproducible environment for the website."

RUN chown -R 1000 /app

# Use non root user with uid 1000
USER 1000

CMD ["/bin/sh", "-c", "npx nx start"]
