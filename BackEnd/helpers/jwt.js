
const jwt = require('jsonwebtoken');

const generarJWT=(uid='')=>{
    //promesa para que sea asincrona
    return new Promise((resolve,reject)=>{
        const payload={uid} //payload es la informacion que se va a encriptar

        jwt.sign(payload,process.env.JWT_SECRET,{
            expiresIn:'24h' //tiempo de expiracion del token
        },
        (err,token)=>{
            if(err){
                console.log(err)
                reject('no se pudo generar el token')
            }
            else{               
                resolve(token)
                console.log("🚀 ~ file: jwt.js:28 ~ returnnewPromise ~ token:", token)
            }         
        }
        )
    })
}


module.exports={    
    generarJWT
}