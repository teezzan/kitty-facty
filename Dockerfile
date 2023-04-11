# Stage 1: Build the app
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Stage 2: Copy only the built application to a new container
FROM node:16-alpine

WORKDIR /app

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package*.json ./
COPY next.config.js ./

ENV NODE_ENV=production

RUN npm install next

EXPOSE 3000

CMD ["npm", "run", "start"]
