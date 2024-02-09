
//Path de login
const {Router}=require('express')
const { validarCampos } = require('../middlewares/validar-campos')
const {check}=require('express-validator') //validadores
const {validarJWt}= require('../middlewares/validar-jwt')
const {login,renewToken,googleSignIn}=require('../controllers/auth');


const router=Router();



//para loguearse
router.post('/',
    [
        check('email','el Email es obligatorio').isEmail(),
        check('password','el password es obligatorio').not().isEmpty(),
        validarCampos//metodo generico
    ],
    login
)


router.post('/google',
    [
        check('token','el token de google es obligatorio').not().isEmpty(),     
        validarCampos//metodo generico
    ],
    googleSignIn
)


router.get('/renew',
    [
       validarJWt
    ],
    renewToken
)







module.exports=router //exportar el modulo