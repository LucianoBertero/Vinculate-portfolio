



const jwt =require('jsonwebtoken');
const Usuario= require('../models/usuario')


const  validarJWt= (req, res, next) => {

    //leer el token en el header
    const token=req.header('x-token');
  
    //verificar el token
    if(!token){ //esto verifica si el token fue mandado en el header solamente

        return res.status(401).json({
            ok:false,
            msg:"no hay token en la peticion"
        })
    }
    try{
        const {uid}=jwt.verify(token,process.env.JWT_SECRET); //verifica el token, y si es valido, devuelve el uid, si esto funcion con la semilla tiene que seguir sino se va al catch
        req.uid=uid  // le asignamos como parametro a la request el uid 
        next()
    }
    catch(err){
        res.status(401).json({
            ok:false,
            msg:"token no valido"
        })
    }



}


const   validarADMIN_ROLE= async(req, res, next) =>{
    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Usuario No existe'
            })
        }
        if(usuarioDB.role!=='ADMIN'){
            return res.status(403).json({
                ok:false,
                msg:'Usuario no es un administrador'
            })
        }
        next()


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}



const   validarADMIN_ROLE_o_MismoUsuario= async(req, res, next) =>{
    const uid = req.uid;
    const id= req.params.id

    try {

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Usuario No existe'
            })
        }
        if(usuarioDB.role!=='ADMIN' && uid===id){
            return res.status(403).json({
                ok:false,
                msg:'Usuario no es un administrador'
            })
        }else{}
        next()


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}



module.exports={
    validarJWt,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}