

//Verificar bien que cosa va a necesitar permiso del jwt porque no todo lo va a necesitar, cosas especificas

const {Router}= require('express')
const {check}=require('express-validator') //validadores
const {validarCampos}=require('../middlewares/validar-campos'); //validadores

const {crearUsuario,getUsuarios,getUsuarioId,eliminarVoluntario,actualizarPassword,actualizarVoluntario,
    getVoluntarioPorNombre}=require('../controllers/usuario');
const { validarJWt } = require('../middlewares/validar-jwt');


const router=Router();


//para crear un usuario
router.post(
    '/',
    [  
        check('name','el nombre es obligatorio').not().isEmpty(), //no tiene que estar vacio
        check('email','el Email es obligatorio').isEmail(),
        check('password','el password es obligatorio').not().isEmpty(),
        validarCampos //tiene que ser el ultimo  campo, sino no se activan los validadores de arriba
    ],
    crearUsuario)



    router.get(
        '/',
        [  
            //validar jwt
        ],
        getUsuarios)
    



        router.get(
            '/:id',
            [  
               validarJWt
            ],
            getUsuarioId)
        
        // borrar un usuario por id pasado por parametro
        router.delete('/:id', eliminarVoluntario)


        //Agregó Jose
        //Ruta para modificacion de voluntario
        router.put(
            "/password/:id",
            [
                //validarJWt,
                // se podria validar tambien que el que lo cambie sea un usuario
                // check('permissions', 'Los permisos son obligatorios').not().isEmpty(),
                // Multer.single("image"), //para subir un solo archivo
                ],
            actualizarPassword
         );
        //Dejo de Agregar


    // Agrego Jose :)

    router.get(
        "/:name",
        [
          //validarJWT
        ],
        getVoluntarioPorNombre
      );
      
      //Ruta para modificacion de voluntario
      router.put(
        "/:id",
        [
          //validarJWt,
          // se podria validar tambien que el que lo cambie sea un usuario
          // check('permissions', 'Los permisos son obligatorios').not().isEmpty(),
          // Multer.single("image"), //para subir un solo archivo
        ],
        actualizarVoluntario
      );

    // Dejo de agregar


    module.exports=router;