const {response}=require('express');
const {validationResult}=require('express-validator')


//valida los checks

const validarCampos=(req,res,next)=>{

    //instancia los errores
    const errores=validationResult(req);
    //pregunta si hay errores
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            errores:errores.mapped()
        })
    }
    //si no hay errores continua al proximo validador
    next();

}




module.exports={
    validarCampos
}