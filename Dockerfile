# FROM node:20-alpine3.17
FROM node:19.8.1-alpine3.16

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

# RUN npm install
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
# CMD ["npm", "run", "dev"]






