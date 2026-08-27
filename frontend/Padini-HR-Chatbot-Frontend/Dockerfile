FROM node:24.15.0 AS frontend
WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3000

CMD [ "npm", "run", "dev"]