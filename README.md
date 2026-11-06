Server node.js for API

This Node.js server allows you to:
  - Back up GladysAssistant databases
  - Restore backed-up databases
  - Upload executable scripts from Gladys
   
http://<ip>:3004/backup_bd // to back up databases

http://<ip>:3004/upload_bd // to upload a backup for restoration

http://<ip>:3004/restore_bd // to restore databases

http://<ip>:3004/upload_script // to upload a script (bash,

http://<ip>:3004/script/<SCRIPT_NAME ARG1 ARG2...> // to run a script


INSTALLATION
Important: The installation must be performed on the server hosting Gladys Assistant.

Using Git:
`mkdir /opt/server-api & cd server-api`
`git clone https://github.com/mgrafr/server-api.git`

Downloading server-api from GitHub:
`https://github.com/mgrafr/server-api/archive/refs/heads/main.zip`

Using Docker:
`docker pull ghcr.io/mgrafr/server-api:1.0.2 // github`
`pull mgrafr/server-api:v7 // docker hub`

USING WITH GLADYS ASSISTANT



en français:
Ce serveur node js permet:
  - de sauvegarder les bases de données de GladysAssistant
  - de restaurer les bases de données sauvegardées
  - de télécharger des scripts exécutable depuis Gladys
  - 
 http://<ip>:3004/backup_bd // pour sauvegarder les bases de données
 http://<ip>:3004/upload_bd // pour televerser une sauvegarde pour la restaurer 
 http://<ip>:3004/restore_bd // pour restaurer les bases de données
 http://<ip>:3004/upload_script // pour televerser un script(bash,python)
 http://<ip>:3004/script/<NOM_SCRIPT ARG1 ARG2...> // pour exécuter un script
 
 INSTALLATION 
 importannt:l’installation doit être faite sur le serveur hebergeant Gladys assitant 

 avec git
 mkdir /opt/server-api & cd server-api
 git clone https://github.com/mgrafr/server-api.git

 en téléchargent server-api depuis github
 https://github.com/mgrafr/server-api/archive/refs/heads/main.zip

 avec Docker
 docker pull ghcr.io/mgrafr/server-api:1.0.2 // github
 pull mgrafr/server-api:v7 // docker hub

 UTILISATION AVEC GLADYS ASSISTANT
 
