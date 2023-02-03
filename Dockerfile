FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json .
COPY tsconfig.json .

RUN rm -rf dist

RUN npm ci

COPY . .

RUN ["npm", "run", "build"]

CMD ["node", "dist/server.js"]

