
FROM node:24-alpine
RUN apk update && apk add bash  --no-cache bash

WORKDIR /app

COPY package*.json ./
COPY --chown=node:node . .
RUN npm install
COPY src/save.sh /opt/server-api/src/save.sh
RUN chmod +x /opt/server-api/src/save.sh
RUN chown -R 1000:1000 /opt/server-api

CMD ["node", "index.js"]
