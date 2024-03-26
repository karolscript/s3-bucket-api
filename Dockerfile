FROM node:21-alpine
RUN apk add --no-cache python3 make g++ py3-pip
RUN mkdir /app
WORKDIR /app
COPY package*.json /app
RUN npm install
COPY . /app
RUN npm rebuild bcrypt --build-from-source
EXPOSE 3000
CMD [ "npm", "start" ]
