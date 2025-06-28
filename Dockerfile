FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci          # faster & reproducible installs

COPY . .
RUN npm run build   # builds your Next.js app

EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "start"]
