FROM node

WORKDIR /usr/app-backend

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn typeorm migration:run

EXPOSE 3333

CMD ["yarn", "dev"]
