FROM node:12

COPY package*.json /
RUN npm install --production

COPY dist/ /
CMD node ./main.js
