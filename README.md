# Server node.js for API

This Node.js server allows you to:
  - Back up GladysAssistant databases
  - Restore backed-up databases
  - Upload executable scripts from Gladys

## Project Structure

project\
├─ server-api *fastify* //# Code Fastify\
│   ├─ index.js\
│   ├─ package.json\
├─ python-service/  # API Python (container docker)\
│   ├─ gunicorn  # web server security\ │  
├─ app.py # Flask\
│   ├─ requirements.txt\
├─ lua   # Serveur LUA  \
│   ├─ app.lua # LUA server docker\
│   ├─ file.lua (file containing the Lua script)\
├─ scripts     External scripts (.py, .sh, .lua)\
│   ├─ test.py\
│   ├─ test.sh\
│   ├─ main.lua\
├─ server-api-compose.yml\
├─ .env

## Features
 
- [ ] http://**IP SERVER**:3004/backup_bd // to back up databases\
- [ ] http://**IP SERVER**:3004/upload // uploading db, py, sh, lua files, ...\
- [ ] http://**IP SERVER**:3004/restore_bd // to restore databases\
- [ ] http://**IP SERVER**:3004/script/<SCRIPT_NAME ARG1 ARG2...> // to run a script\
      // If an argument is composed of several words, it must be surrounded by quotation marks\
      // so that The shell considers it as a single argument.\
 - [ ] http://**IP SERVER**:3004/add_mod_py<MODULE PYTHON NAME> // to add a module to requirements.txt\
      // note: if the installation is done under Docker

## Installation & execution
**Important: The installation must be performed on the server hosting Gladys Assistant.**

  **Using Git**\
  *cd /opt*\
  *git clone https://github.com/mgrafr/server-api.git* \
  *cd server-api*
  *node index.js*

  **Downloading server-api from GitHub**\
  - *cd /opt*\
  - *wget "https:\/\/github.com/mgrafr/server-api/archive/refs/heads/main.zip"*
  - *unzip main.zip*
  - *mv server-api-main server-api*
  - 
  **Using Docker:**\
  - *docker pull ghcr.io/mgrafr/server-api:1.0.2 // github*
  - *docker pull ghcr.io/mgrafr/python-service:1.0.2 // github*\
   or at docker.io
  - *pull mgrafr/server-api:v8 // docker hub*
  - *pull mgrafr/python-service:v2 // docker hub*\
   execution:
  - *cd /opt/server-api*
  - *wget "https:\/\/github.com/mgrafr/server-api/blob/dev/server-api-compose.yml"*
  - *docker compose -f server-api-compose up-build -d*

**environment variables**\
   Contents of the .env file
 - *CT_LUA=mgrafr/docker-lua // or ghcr.io/mgrafr/docker-lua* 
 - *PORT_SERVER-API=3004*
  
# Using Gladys assistant



**en français:**
Ce serveur node js permet:\
  - de sauvegarder les bases de données de GladysAssistant\
  - de restaurer les bases de données sauvegardées\
  - de télécharger des scripts exécutable depuis Gladys
  - 
## Structure du projet

project\
 ├─ server-api *fastify*    # Code Fastify\
 │   ├─ server.js\
 │   ├─ package.json\
 ├─ python-service   # API Python (Conteneur Docker) \
 │   ├─ gunicorn //  sécurisation serveur web\
 │   ├─ app.py // Flask\
 │   ├─ app.py\
 │   ├─ requirements.txt\
 ├─ lua   # Serveur LUA (Seulement Conteneur Docker) \
 │   ├─ file.lua    (fichier contenant le script lua)\
 ├─ scripts         Scripts externes (.py, .sh, .lua)\
 │   ├─ test.py\
 │   ├─ test.sh\
 │   ├─ main.lua\
 ├─ server-api-compose.yml\
 ├─ .env
 
 ##  Fonctionnalités
 
 - [ ] http://**IP SERVEUR**:3004/backup_bd // pour sauvegarder les bases de données\
 - [ ] http://**IP SERVER**:3004/upload // téléversement de fichiers db,py,sh,lua, ...\
 - [ ] http://**IP SERVEUR**:3004/restore_bd // pour restaurer les bases de données\
 - [ ] http://**IP SERVEUR**:3004/script/<NOM_SCRIPT ARG1 ARG2...> // pour exécuter un script\
       // si un argument est composé de plusieurs mots il faut l’entourer de guillemets pour que\
       // le shell le considère comme un seul argument.\
  - [ ] http://**IP SERVEUR**:3004/add_mod_py<NOM DU MODULE PYTHON> // pour ajouter un module à requirements.txt\
       // note : si l'installation est effectuée sous Docker
  
## Installation & exécution
 **importannt:l’installation doit être faite sur le serveur hebergeant Gladys assitant** \
 *Running Lua scripts is only possible after installing the "docker-lua" container*

**avec git**\
 *cd /opt*\
 *git clone https://github.com/mgrafr/server-api.git* \
 *cd server-api*\
 *node index.js // démarrage de server-api*
 
 **en téléchargent server-api depuis github**\
- *cd /opt*
- *wget "https:\/\/github.com/mgrafr/server-api/archive/refs/heads/main.zip"*
- *unzip main.zip*
- *mv server-api-main server-api*

 **avec Docker**\
- *docker pull ghcr.io/mgrafr/server-api:1.0.2 // github*
- *docker pull ghcr.io/mgrafr/python-service:1.0.2 // github*\
  ou chez docker.io
- *pull mgrafr/server-api:v8 // docker hub*
- *pull mgrafr/python-service:v2 // docker hub*
- *cd /opt/server-api*
- *wget https:\/\/github.com/mgrafr/server-api/blob/dev/server-api-compose.yml*
- *docker compose -f server-api-compose up-build -d*

 **variables d’environnement**\
 Contenu du fichier .env
 - *CT_LUA=mgrafr/docker-lua // ou  ghcr.io/mgrafr/docker-lua* 
 - *PORT_SERVER-API=3004*
  
 # Utilisation avec Gladys assistant
 
