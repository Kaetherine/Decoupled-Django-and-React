FROM node:18-alpine

WORKDIR /mysite_react
COPY package.json .

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]