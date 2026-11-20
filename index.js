const Fastify = require('fastify');
const fastify = Fastify({ logger: true });
const { exec } = require('child_process');
const path = require('path');
const fastifyStatic = require('@fastify/static');
const fastifyMultipart = require('@fastify/multipart')
// const { pipeline } = require('node:stream/promises')
const pump = require('pump')
//const { fileURLToPath } = require('url');
const HOST="0.0.0.0";
const PORT= 3004;
const traps = require('@dnlup/fastify-traps')
const fs = require('fs')
const fsPromises = require('fs').promises;
const axios = require('axios');
 const { spawn } = require('child_process');

// Register multipart plugin for file uploads
fastify.register(require('@fastify/multipart'));

fastify.register(require('@fastify/cors'), {
  origin: '*' //  affiner si besoin pour plus de securiteé
});
// POUR VERSION SEND FICHIER
// Enregistrement du plugin avec le dossier contenant vos fichiers publics
fastify.register(fastifyStatic, {
  root: '/opt/server-api/backups',
  prefix: '/opt/server-api/backups/', // Optionnel : préfixe pour vos URL (ex: /public/mon-fichier.pdf)
});


function runLuaInDockerFromCode(luaCode) {
    return new Promise((resolve, reject) => {
        // Lancer le conteneur Docker
        const docker = spawn('docker', [ 'run', '-i', 'mgrafr/docker-lua', 'lua', '-' ]);
        let output = '';
        let errorOutput = '';

        // Récupérer stdout
        docker.stdout.on('data', (data) => {
            output += data.toString();
        });

        // Récupérer stderr
        docker.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });

        // Gestion de la fin du processus
        docker.on('close', (code) => {
            if (code !== 0) {
                return reject(new Error(`Erreur Docker/Lua: ${errorOutput}`));
            }
            resolve(output.trim());
        });
  // Envoyer le code Lua au conteneur
        docker.stdin.write(luaCode);
        docker.stdin.end();
    });
}

// Fonction pour exécuter un fichier Lua dans Docker
/*function runLuaInDocker(filePath) {
    return new Promise((resolve, reject) => {
        // Vérifier que le fichier existe
        if (!fs.existsSync(filePath)) {
            return reject(new Error('Fichier Lua introuvable'));
        }

        // Commande Docker : monte le dossier et exécute Lua
        const cmd = `docker run --rm -v ${path.resolve('./lua_scripts')}:/scripts lua:5.4 lua /scripts/${path.basename(filePath)}`;
//docker run  -v main.lua:/scripts lua_dev scripts/
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                return reject(new Error(`Erreur Docker: ${stderr || error.message}`));
            }
            resolve(stdout.trim());
        });
    });
}
*/

fastify.post('/upload_bd', async function (req, reply) {
  // return the first file submitted, regardless the field name
  const data = await req.file()
  // data.file // stream
  // data.fields // other parsed parts
  // data.fieldname
  // data.filename
  // data.encoding
  // data.mimetype
  // nous devons consommer le fichier
  // nous utilisons pump pour gérer correctement les flux et attendre la fin du tuyau
   const uploadPath = path.join(process.cwd(), 'uploads', data.filename)
   const writeStream = fs.createWriteStream(uploadPath)
  try {
  await pump(data.file, writeStream)
  return { 
      message: 'Fichier enregistré avec succès',
      filename: data.filename 
   }
  } catch (err) {
    // En cas d'erreur, Fastify gère la fermeture des flux automatiquement si configuré, 
    // mais il est safe de renvoyer une erreur 500
    fastify.log.error(err)
    return reply.code(500).send({ error: "Erreur lors de l'enregistrement du fichier" })
  }    
})

fastify.post('/upload_script', async function (req, reply) {
  const data = await req.file()
  const uploadPath = path.join(process.cwd(), 'scripts', data.filename)
  const writeStream = fs.createWriteStream(uploadPath)
  try {
  await pump(data.file, writeStream)
  return { 
      message: 'Fichier enregistré avec succès',
      filename: data.filename 
   }
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send({ error: "Erreur lors de l'enregistrement du fichier" })
  }    
})

fastify.get('/add_mod_py/:texte', async (request, reply) => {
  const { texte } = request.params;

  if (!texte) {
    return reply.code(400).send({ erreur: 'Le nom du module Python est requis.' });
  }
  // Chemin vers le fichier requirements.txt
  const uploadMod = path.join(process.cwd(), 'python-service', 'requirements.txt');
  // Ajout du retour à la ligne (\n) à la fin du texte
  const newMod = `${texte}\n`;
  try {
    const content  = fs.readFileSync(uploadMod, 'utf8');
    const exists = content.includes(texte);
    if (exists) { return  {info: `Le module "${texte}" est déjà présent dans le fichier.`} }
    else {
      await fsPromises.appendFile(uploadMod, newMod, 'utf8');
      return { succes: true, message: 'Module "' + texte +'" ajouté avec succès.' };
      }   
    } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ erreur: 'Impossible d\'écrire dans le fichier.' });
      }
    });







fastify.get('/', function (request, reply) {
  reply
    .code(200)
    .send({ statut:"OK" })
})

fastify.get('/backup_bd', async (request, reply) => {
  try {
    // Use an absolute, validated path to avoid command injection
    const scriptPath = path.resolve('/opt/server-api/src/save.sh');

// Execute the script
    return await new Promise ((resolve, reject) => {
      exec(`sh "${scriptPath}"`, { timeout: 60_000 }, (error, stdout, stderr) => {
        if (error) {
          // Log and reject on error
          fastify.log.error(error);
          return reject(reply.code(500).send({ error: 'Backup failed', details: stderr || error.message }));
        }
       
      let nomFichier = fs.readFileSync('/opt/server-api/backups/sauvegarde.txt','utf8');
      nomFichier =nomFichier.replace(/[\u200B-\u200D\u2060\uFEFF\u00AD]/g, '').replace(/[\u00A0\u202F\u2007]/g, ' ').trim()
      console.log("sauvegarde="+nomFichier);
// POUR VERSION SEND FICHIER
  // Optionnel : Forcer le navigateur à télécharger le fichier plutôt qu'à essayer de l'ouvrir
  reply.header('Content-Disposition', `attachment; filename="${nomFichier}"`);

  // Définir le bon type MIME pour une archive .tar.gz: gzip
  reply.type('application/x-tar');
  // --------------------------------------------------"-------------
  const filePath = "/opt/server-api/backups/"+nomFichier;
  reply.send(fs.createReadStream(filePath)); //pour gladys
 // ------------------------------------------------------------------
  // Envoyer le fichier (le chemin est relatif au dossier 'root' défini plus haut)
 // return reply.sendFile(nomFichier);
  //------------------------------------------------------------------
// reply.type('application/json);
 // reply.send({ lien: "curl.exe -F file=@C:\<Users\Downloads>\datas.tar.gz http://192.168.1.131:<PORT_SERVER-API>/upload" });
});
  });
  }
  catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ error: 'Unexpected server error' });
  }
});

fastify.get('/restore_bd', async (request, reply) => {
  try {
    // Use an absolute, validated path to avoid command injection
    const scriptPath = path.resolve('src/restore.sh');

// Execute the script
    return await new Promise ((resolve, reject) => {
      exec(`sh "${scriptPath}"`, { timeout: 60_000 }, (error, stdout, stderr) => {
        if (error) {
          // Log and reject on error
          fastify.log.error(error);
          return reject(reply.code(500).send({ error: 'Backup failed', details: stderr || error.message }));
        }
  reply.type('application/json');
  
 reply.send({ lien: "Bases de données sauvegardées" });
});
  });
  }
  catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ error: 'Unexpected server error' });
  }
});
fastify.get('/script/:file', async (request, reply) => {
  try {
    const { file } = request.params;
    const ar = file.split(' ');
     /*if (!file || typeof file !== 'string') {
            reply.code(400);
            return { error: 'Paramètre "file" requis' };
        }*/
    const ext = path.extname(ar[0]);console.log("ext="+ext);
    switch (ext) {
      case ".py":
      case ".sh":
        const response = await axios.post('http://python_service:5004/run', { file } );
        return response.data;
        break;
      case ".lua": console.log("file="+file) ;
        const code = fs.readFileSync('/opt/server-api/scripts/'+ file , 'utf8', (err, text) => {
        if (err) {
        console.error('Could not read:', err.message);
        return;
        }
        });
        const rawOutput = await runLuaInDockerFromCode(code);
        // Essayer de parser le JSON renvoyé par Lua
        let parsedOutput;
         try {
            parsedOutput = JSON.parse(rawOutput);
         } catch {
            parsedOutput = { value: rawOutput };
         }

         return { luaResult: parsedOutput };
      break;
      default:
      message = "Invalid extension fichier.";
    }
   } catch (err) {
    fastify.log.error(err);
    return reply.code(500).send({ error: 'Failed to run script', details: err.message });
  }
});


fastify.register(traps, {
  timeout: 5000 // wait 5 second before forcing exiting
})
fastify.get('/stop', (request, reply) => {
  reply.send({ ok: true })
})
const start = async () => {
  try {
    await fastify.listen({ host: HOST, port: PORT });
    console.log('Fastify file upload server running on http://localhost:3004');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
