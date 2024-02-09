const { Router } = require("express");
const { check } = require("express-validator"); //validadores
const { validarCampos } = require("../middlewares/validar-campos"); //validadores

const { changePassword,getMapCoordinatesEvent,getMapCoordinatesOng } = require("../controllers/utilities");
const { validarJWt } = require("../middlewares/validar-jwt");

const router = Router();

router.put(
  "/changePassword/:id",
  [
    check("oldPassword", "La contraseña actual es requerida").not().isEmpty(),
    check("newPassword", "La contraseña nueva es requerida").not().isEmpty(),

    validarJWt,
  ],
  changePassword
);


router.get(
  "/mapcoordinatesEvent",
  [
    validarJWt
  ],
  getMapCoordinatesEvent
);


router.get(
  "/mapcoordinatesOng",
  [
    validarJWt
  ],
  getMapCoordinatesOng
);



module.exports = router; //exportar el modulo
