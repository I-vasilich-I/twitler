FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY package-lock.json .

RUN npm install

RUN mkdir node_modules/.cache && chmod -R 777 node_modules/.cache

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]