
const { getISOWeek } = require('date-fns');

const {response}=require('express');
const Usuario=require('../models/usuario');
const bcrypt= require('bcryptjs');
const Organizacion=require('../models/organizacion')

const Estadisticas = require('../models/estadisticas')
const {generarJWT}=require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const usuario = require('../models/usuario');




//login controla el login de usuario y organizacion
const login = async(req,res=response) => {
    
    const { email, password } = req.body;
    try
    {
        //instanciar usuario y organizacion
        const usuarioDB= await Usuario.findOne({email})
        const organizacionDB = await Organizacion.findOne({email});
        //Verificar Email es usuario o ong

        if(!usuarioDB && !organizacionDB){ //si no existe el email ya esta weon
            return res.status(404).json({
                ok:false,
                msg:"Email no encontrado"
            })
        }
        if(usuarioDB && !organizacionDB){

            console.log('Encontro usuario')
            const validPassword = bcrypt.compareSync( password, usuarioDB.password ); //compara el password que se envia con el password que esta en la base de datos, devulve tru si hace match
        
            if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:"Credenciales no validas"
            })
            }

        //generar token
        const token = await generarJWT(usuarioDB.id); //genera el token, y lo guarda en la variable token
        await registerLoginStatistic()
        res.json({
            ok:true,
            token,
            usuario:usuarioDB
         
        })

        }else{
            console.log('Encontro organizacion')
            const validPassword = bcrypt.compareSync( password, organizacionDB.password )
            if(!validPassword){
                return res.status(400).json({
                    ok:false,
                    msg:"password no valido"
                })
            } 
            if(organizacionDB.permissions!=="APPROVED"){
                return res.status(404).json({
                    ok:false,
                    msg:"Organizacion pendiente de aprobacion"
                })
            }
            const token = await generarJWT(organizacionDB.id); //genera el token, y lo guarda en la variable token
            await registerLoginStatistic()
            res.json({
                ok:true,
                token,
                msg:"Organizacion aprobada",
                usuario:organizacionDB             
            })
        }
             
    }

    catch(err)
    {
        console.log(err);
        res.status(500).json({
            ok:false,
            msg:"Hable con el administrdador"
            
        })
    }
}



const renewToken=async (req,res=response)=>{

    const uid=req.uid
    const token = await generarJWT(uid)

    //Obtener el usuario por el id

    const usuarioDB = await Usuario.findById(uid)
    const organizacionDB= await Organizacion.findById(uid)

    if(!usuarioDB && !organizacionDB){

        return res.status(404).json({
            ok:false,
            msg:"Usuario no encontrado"
        })
    }
    if(usuarioDB){
        console.log('Encontro usuario')
        res.json({
            ok:true,
            uid,
            token,
            usuario:usuarioDB,          
        })
    }
    if(organizacionDB){

        console.log('Encontro organizacion')
        res.json({
            ok:true,
            uid,
            token,
            usuario:organizacionDB,          
        })
    }
 
}
const googleSignIn = async (req, res = response) => {
    try {
        console.log("es por acá");

        const googleUser = await googleVerify(req.body.token);
        const { name, email, picture } = googleUser;

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                name: name,
                email: email,
                password: '@@@',
                role: 'USER_ROLE',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

  
        await registerLoginStatistic(); // Espera a que la función se complete
   

        const token = await generarJWT(usuario.id);

       
        res.json({
            ok: true,
            boy: googleUser,
            usuario,
            token,
            googleId: req.body.token
        });
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: "Token de Google no es correcto"
        });
    }
};

const registerLoginStatistic = async () => {
    try {
        const now = new Date();
        const mes = now.getMonth() + 1; // El mes actual (tener en cuenta que en JavaScript los meses van de 0 a 11)
        const anio = now.getFullYear();
        const dia = now.getDate(); // El día actual

        // Busca si ya existe una estadística para este mes y año.
        let estadistica = await Estadisticas.findOne({ mes, anio });

        if (estadistica) {
            // Si ya existe una estadística para este mes y año, busca el día actual en las estadísticas.
            const diaActual = estadistica.loginsPorDias.find((diaStat) => diaStat.dia === dia);

            if (diaActual) {
                // Si existe una estadística para el día actual, incrementa el conteo de logins.
                diaActual.logins += 1;
            } else {
                // Si no existe una estadística para el día actual, crea una nueva estadística para el día actual.
                estadistica.loginsPorDias.push({ dia, logins: 1 });
            }
        } else {
            // Si no existe una estadística para este mes y año, crea una nueva estadística con el día actual.
            estadistica = new Estadisticas({
                mes,
                anio,
                loginsPorDias: [{ dia, logins: 1 }],
            });
        }

        await estadistica.save();
        console.log('Estadística de login registrada con éxito.');
    } catch (error) {
        console.error('Error al registrar estadística de login:', error);
    }
};




    


 



    
 


module.exports={
    login,   
    renewToken,
    googleSignIn,

}