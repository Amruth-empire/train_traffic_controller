
FROM node:20-alpine AS builder


WORKDIR /app


RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml postcss.config.mjs ./
RUN pnpm install --frozen-lockfile


COPY . .
RUN pnpm run build


FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production


COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "3000"]
