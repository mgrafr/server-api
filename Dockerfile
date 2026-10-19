
FROM node:24-alpine
RUN apk update && apk add bash  --no-cache bash

WORKDIR /app

COPY package*.json ./
COPY --chown=node:node . .
RUN npm install
RUN mkdir -p /opt/server-api/backups
RUN chown -R 1000:1000 /opt/server-api
RUN chmod -R 666 /opt/server-api
## Crée un nouvel utilisateur appelé 'appuser' avec l'identifiant utilisateur 1000
RUN useradd -m -u 1000 appuser
## Crée un répertoire pour l'application et définit la propriété
RUN chown -R appuser:appuser /app
## Passe à l'utilisateur non root
USER appuser
COPY src/save.sh /opt/server-api/src/save.sh
RUN chmod +x /opt/server-api/src/save.sh

CMD ["node", "index.js"]
