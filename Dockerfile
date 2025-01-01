# postgres db
FROM postgres:latest
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=einkoof
ENV POSTGRES_HOST=postgres
ENV POSTGRES_PORT=5432
# sveltekit frontend app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
COPY .env.example .env
RUN npm i -g pnpm
RUN pnpm i
COPY . .
RUN pnpm build
RUN pnpm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT_HEADER=x-forwarded-port
ENV PORT=3000
ENV ORIGIN=http://localhost:3000
EXPOSE 3000


CMD ["node", "build"]