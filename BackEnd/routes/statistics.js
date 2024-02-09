




const { Router } = require("express");
const { check } = require("express-validator"); //validadores
const { validarCampos } = require("../middlewares/validar-campos"); //validadores

const {getUsers,getPageViewStatistics } = require("../controllers/statistics");
const { query, validationResult } = require('express-validator');

const { validarJWt } = require("../middlewares/validar-jwt");

const router = Router();






router.get(
    "/users",
    [


        validarJWt

 
    ],
    getUsers
  );


  router.get(
    '/pageViewStatistics',
    [
      query('mes').optional().isInt().withMessage('El mes debe ser un número entero válido'),
      query('anio').isInt().withMessage('El año debe ser un número entero válido').notEmpty(),
      validarJWt,
    ],
    getPageViewStatistics
  );
  



  module.exports = router; //exportar el modulo