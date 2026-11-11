
const Fastify = require('fastify');
const fastify = Fastify({ logger: true });
const { exec } = require('child_process');
const path = require('path');
const fastifyStatic = require('@fastify/static');
const fastifyMultipart = require('@fastify/multipart')
// const { pipeline } = require('node:stream/promises')
const pump = require('pump')
const { fileURLToPath } = require('url');
const HOST="0.0.0.0";
const PORT= 3004;
const traps = require('@dnlup/fastify-traps')
const fs = require('fs')
const fsPromises = require('fs').promises;
const axios = require('axios');
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
    const response = await axios.post('http://127.0.0.1:5004/run', { file } );
    return response.data;
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
