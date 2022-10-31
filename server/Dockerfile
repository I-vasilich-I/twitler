FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json .

COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE ${PORT}

RUN npx prisma generate

CMD [ "npm", "run", "start:dev" ]