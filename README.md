# Server node.js for API

This Node.js server allows you to:
  - Back up GladysAssistant databases
  - Restore backed-up databases
  - Upload executable scripts from Gladys

## Project Structure

project\
 ├─ server-api *fastify*/          # Code Fastify\
 │   ├─ server.js\
 │   ├─ package.json\
 ├─ python-service/  # API Python (Container Docker)\
 │   ├─ app.py\
 │   ├─ requirements.txt\
 ├─ scripts/          # Scripts externes (.py, .sh)\
 │   ├─ test.py\
 │   ├─ test.sh\
 ├─ docker-compose.yml\

## Features
 
- [ ] http://<ip>:3004/backup_bd // to back up databases\
- [ ] curl.exe -F file=@C:<PATH>\<FILE> http://<IP de GLADYS>:3004//upload_script/<FILE>\
      // To upload a file (backup for restoration or .py & .sh file for execution)\
- [ ] http://<ip>:3004/restore_bd // to restore databases\
- [ ] http://<ip>:3004/script/<SCRIPT_NAME ARG1 ARG2...> // to run a script

## Installation\
**Important: The installation must be performed on the server hosting Gladys Assistant.**

  **Using Git**\
  *cd /opt*\
  *git clone https://github.com/mgrafr/server-api.git* \
  *cd server-api*

  **Downloading server-api from GitHub:**

   *https://github.com/mgrafr/server-api/archive/refs/heads/main.zip*

  **Using Docker:**\
   *docker pull ghcr.io/mgrafr/server-api:1.0.2 // github*\
   *docker pull ghcr.io/mgrafr/python-service:1.0.2 // github*\
   *pull mgrafr/server-api:v8 // docker hub*\
   *pull mgrafr/python-service:v2 // docker hub*

  **Docker compose** 
  - *server-api-compose.yml*

# Using Gladys assistant



**en français:**
Ce serveur node js permet:\
  - de sauvegarder les bases de données de GladysAssistant\
  - de restaurer les bases de données sauvegardées\
  - de télécharger des scripts exécutable depuis Gladys
  - 
## Structure du projet

project\
 ├─ server-api *fastify*          # Code Fastify\
 │   ├─ server.js\
 │   ├─ package.json\
 ├─ python-service/   # API Python (Conteneur Docker) \
 │   ├─ app.py\
 │   ├─ requirements.txt\
 ├─ scripts/          # Scripts externes (.py, .sh)\
 │   ├─ test.py\
 │   ├─ test.sh\
 ├─ docker-compose.yml
 
 ##  Fonctionnalités
 
 - [ ] http://<ip>:3004/backup_bd // pour sauvegarder les bases de données\
- [ ] curl.exe -F file=@C:<PATH>\<FILE> http://<IP de GLADYS>:3004//upload_script/<FILE>\
     // Pour téléverser un fichier (sauvegarde pour restauration ou fichier.py & sh pour exécution)
 - [ ] http://<ip>:3004/restore_bd // pour restaurer les bases de données\
 - [ ] http://<ip>:3004/script/<NOM_SCRIPT ARG1 ARG2...> // pour exécuter un script
 
## Installation\
 **importannt:l’installation doit être faite sur le serveur hebergeant Gladys assitant** 

**avec git**\
 *cd /opt*\
 *git clone https://github.com/mgrafr/server-api.git* \
 *cd server-api*
  
 **en téléchargent server-api depuis github**\
- *https://github.com/mgrafr/server-api/archive/refs/heads/main.zip*

 **avec Docker**\
- *docker pull ghcr.io/mgrafr/server-api:1.0.2 // github*\
- *docker pull ghcr.io/mgrafr/python-service:1.0.2 // github*\ 
- *pull mgrafr/server-api:v8 // docker hub*\
- *pull mgrafr/python-service:v2 // docker hub*\

 **Docker compose** 
 - *server-api-compose.yml*

 # Utilisation avec Gladys assistant
 
