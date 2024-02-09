var admin = require("firebase-admin");
const { Storage } = require('@google-cloud/storage');
var serviceAccount = require("../services/credential.json");
const BUCKET = "vinculate-2023.appspot.com";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET,
});


const bucket = admin.storage().bucket();



// const storage = new Storage();
// const bucketName = 'vinculate-2023.appspot.com';




// const deleteImage = async (req, res, next) => {

//     await bucket.file('organizacion/1685690971995.Captura.JPG').delete(); //acordarse de poner la ruta dentro del bucket
  
     
// }

const deleteImg=async (img)=>{
  const url=img
  const partesDeUrl = url.split('/');
  const ultimaParte = partesDeUrl[partesDeUrl.length - 1];
  await bucket.file(`organizacion/${ultimaParte}`).delete();
}



const uploadImageOng = (req) => {
    return new Promise((resolve, reject) => {
      if (!req.file) {
        return reject("No se encontró ningún archivo.");
      }
    
      const image = req.file;
      const nombreArchivo = Date.now() + "." + image.originalname;
      const rutaArchivo = 'organizacion/' + nombreArchivo;
      const file = bucket.file(rutaArchivo);
      const stream = file.createWriteStream({
        metadata: {
          contentType: image.mimetype,
        },
      });
    
      stream.on("error", (err) => {
        console.log(err);
        reject("Error al subir el archivo.");
      });
    
      stream.on("finish", () => {
        file.makePublic()
          .then(() => {
            const url = `https://storage.googleapis.com/${BUCKET}/${rutaArchivo}`;
            resolve(url);
          })
          .catch((err) => {
            console.log(err);
            reject("Error al hacer público el archivo.");
          });
      });
    
      stream.end(image.buffer);
    });
  };



module.exports={uploadImageOng,deleteImg}