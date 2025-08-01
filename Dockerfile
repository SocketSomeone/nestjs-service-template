FROM node:20-alpine AS builder

WORKDIR /sources

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
RUN yarn cache clean

COPY . .

RUN npm run build

FROM node:20-alpine AS staging

WORKDIR /app

COPY --from=builder /sources/package.json /sources/yarn.lock ./
COPY --from=builder /sources/tsconfig.json /sources/tsconfig.build.json ./
COPY --from=builder /sources/nest-cli.json ./
COPY --from=builder /sources/.swcrc ./
COPY --from=builder /sources/dist ./dist

ENV NODE_ENV=development

RUN yarn install --frozen-lockfile
RUN yarn cache clean

EXPOSE 8080

CMD ["node", "./dist/main.js"]

FROM node:20-alpine AS production

WORKDIR /app

COPY --from=builder /sources/package.json /sources/yarn.lock ./
COPY --from=builder /sources/tsconfig.json /sources/tsconfig.build.json ./
COPY --from=builder /sources/nest-cli.json ./
COPY --from=builder /sources/.swcrc ./
COPY --from=builder /sources/dist ./dist

ENV NODE_ENV=production

RUN yarn install --frozen-lockfile --production
RUN yarn cache clean


HEALTHCHECK --interval=10s --timeout=4s --retries=5 --start-period=10s \
	CMD node -e "require('http').get({host: 'localhost', port: 8080, timeout: 3000}, res => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

EXPOSE 8080

CMD ["node", "./dist/main.js"]
