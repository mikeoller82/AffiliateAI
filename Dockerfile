FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build   # builds your Next.js app

EXPOSE 3000
ENV NODE_ENV=production
ENV NPM_CONFIG_LEGACY_PEER_DEPS=true
CMD ["npm", "start"]
