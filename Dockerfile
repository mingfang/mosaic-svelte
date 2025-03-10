FROM node:20.2

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV="production"
ENV HOST=0.0.0.0
ENV PORT=3000
CMD ["npm", "start"]