FROM node:alpine

WORKDIR /usr/app
COPY package.json .
RUN npm install nodemon
RUN npm install --only=prod
COPY ./dist ./dist

CMD ["npm", "start"]