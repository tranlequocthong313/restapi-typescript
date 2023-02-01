FROM node:18

ADD package.json package-lock.json ./

RUN rm -rf build

RUN npm i

ADD ./ /src


