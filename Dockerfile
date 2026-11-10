
FROM node:24-alpine
RUN apk update && apk add bash  --no-cache bash nodejs npm sqlite

RUN  mkdir -p /opt/server-api/backups &  mkdir -p /opt/server-api/data & mkdir -p /opt/server-api/uploads
RUN chmod -R 777 /opt/server-api/data & chmod -R 777 /opt/server-api/backups & chmod -R 777 /opt/server-api/uploads

RUN chown node:node /opt/server-api/backups 
RUN chown node:node /opt/server-api/data

RUN mkdir -p /data && chown node:node /data
VOLUME ["/data"]

# Créer le répertoire de travail
WORKDIR /app

# Donner les droits au dossier /app à l'utilisateur 'node' (présent par défaut dans les images node:alpine)
RUN chown node:node /app

# Passer à l'utilisateur non-root 'node'
USER node

# Copier package.json et package-lock.json en attribuant la bonne propriété
COPY --chown=node:node package*.json ./

RUN npm install --only=production

# Copier le reste du code source
COPY --chown=node:node . .
RUN chmod +x src/save.sh

EXPOSE 3004

CMD ["node", "index.js"]




