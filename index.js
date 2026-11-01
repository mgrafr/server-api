
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
const SMB2 = require("samba-client"); // npm install smb2

// Configuration SMB2
let smbClient = new SMB2({
  address: '//192.168.1.35/Backup', // Nom du serveur et du partage SMB
  domain: 'WORKGROUP',         // Domaine ou WORKGROUP
  username: 'michel',         // Nom d'utilisateur SMB
  password: 'Idem4546'   // Mot de passe SMB
  // port: 445                   // Port SMB2 (par défaut 445)
});

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

fastify.post('/upload', async function (req, reply) {
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



// Route pour lister les fichiers d'un dossier SMB2
fastify.get('/list_samba', async (request, reply) => {
  try {
    await smbClient.mkdir('essai');
    //const files = await new Promise((resolve, reject) => {
      //smbClient.readdir('\\', (err, list) => {
        //if (err) return reject(err);
        //console.log(list);
        //resolve({ success: true, list });
        //resolve(list);
        //for (let i = 0; i < list.length; i++){
        //    console.log(list[i]);
        //}
      //});
    //});
// Générer une page HTML simple avec liens de téléchargement
//    let html = `<h1>Liste des fichiers SMB2</h1><ul>`;
//    files.forEach(file => {
//      html += `<li><a href="/file/${encodeURIComponent(file)}">${file}</a></li>`;
//    });
//html += `</ul>`;
//    reply.type('text/html').send(html);

  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Failed to list files' });
  }
});


// Route pour streamer un fichier SMB2
fastify.get('/file/:name', async (request, reply) => {
  try {
    const fileName = request.params.name;

    // Sécurité : empêcher les chemins relatifs dangereux
    if (fileName.includes('..')) {
      return reply.code(400).send({ error: 'Invalid file name' });
    }
const smbPath = path.join('\\', fileName);

    const smbStream = smbClient.createReadStream(smbPath);

    smbStream.on('error', (err) => {
      fastify.log.error(err);
      reply.code(500).send({ error: 'Failed to stream file' });
    });
reply
      .header('Content-Type', 'application/octet-stream')
      .header('Content-Disposition', `attachment; filename="${fileName}"`);

    return reply.send(smbStream);
  } catch (err) {
    fastify.log.error(err);
    reply.code(500).send({ error: 'Unexpected error' });
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
    const scriptPath = path.resolve('src/save.sh');

// Execute the script
    return await new Promise ((resolve, reject) => {
      exec(`sh "${scriptPath}"`, { timeout: 60_000 }, (error, stdout, stderr) => {
        if (error) {
          // Log and reject on error
          fastify.log.error(error);
          return reject(reply.code(500).send({ error: 'Backup failed', details: stderr || error.message }));
        }
const nomFichier = 'datas.tar.gz';

// POUR VERSION SEND FICHIER
  // Optionnel : Forcer le navigateur à télécharger le fichier plutôt qu'à essayer de l'ouvrir
  //reply.header('Content-Disposition', `attachment; filename="${nomFichier}"`);

  // Définir le bon type MIME pour une archive .tar.gz
  reply.type('application/json');
  //const filePath = '/opt/server-api/backups/datas.tar.gz';
 // reply.send(fs.createReadStream(filePath)); //pour gladys
  // Envoyer le fichier (le chemin est relatif au dossier 'root' défini plus haut)
    //return reply.sendFile(nomFichier);


 reply.send({ lien: "curl.exe -F file=@C:\<Users\Downloads>\datas.tar.gz http://192.168.1.131:<PORT_SERVER-API>/upload" });
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

fastify.get('/script/:interpreteur/:name', function (request, reply) {
  // curl ${app-url}/example/12345
  // userId === '12345'
   try {
  const { interpreteur,name } = res.params;
    if (!interpreteur || !name) {
            return res.status(400).json({ error: 'Missing required parameters.' });
        }
      // Respond with extracted parameters
        res.json({
            message: 'Parameters received successfully.',
            interpreteur: interpreteur,
            name: name
        });  
  } catch (err) {
        console.error('Error handling request:', err);
        res.status(500).json({ error: 'Internal server error.' });
    }        

})

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
