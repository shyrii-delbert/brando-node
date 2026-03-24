FROM node:20-slim AS deps
WORKDIR /app
RUN npm i sharp@0.33.5 --no-save --no-package-lock \
  && npm cache clean --force

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY dist/app.js ./app.js
COPY dist/assets ./dist/assets
CMD ["app.js"]
