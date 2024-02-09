const { Router } = require("express");
const { check } = require("express-validator"); //validadores
const { validarCampos } = require("../middlewares/validar-campos"); //validadores

const { subscribe,getUserSubscriptions,deleteSubscription } = require("../controllers/subscription");


const { validarJWt } = require("../middlewares/validar-jwt");

const router = Router();


router.post(

    "/:id",
    [

        check("eventId", "el identificador del evento es obligatoriio").not(),
        validarJWt

 
    ],
    subscribe
  );


  router.get(
    "/:id",
    [


        validarJWt

 
    ],
    getUserSubscriptions
  );

  router.delete(
    "/:id/:subscription/:eventId",
    [
  

        validarJWt

 
    ],
    deleteSubscription
  );


module.exports = router; //exportar el modulo
