const { Router } = require("express");
const { check } = require("express-validator"); //validadores
const { validarCampos } = require("../middlewares/validar-campos"); //validadores
const {
  getOrganizacionesPorId,
  crearOrganizacion,
  getOrganizaciones,
  actualizarRolOng,
  getOrganizacionesPorNombre,
  actualizarOrganizacion,
  elimiarOng,
  getOrganizationEvents,
  getOrganizationsApprove,

  getDonations,postDonations,
  changeState

} = require("../controllers/organizacion");
const { validarJWt } = require("../middlewares/validar-jwt");
const { get } = require("mongoose");
const { uploadImageOng } = require("../services/firebase");

//subir archivo creando la organizacion
const multer = require("multer");
const Multer = multer({
  storage: multer.memoryStorage(),
  limits: 1024 * 1024,
});

const router = Router();

//crear un usuario
//como hay que subir una foto lo mandamos todo en el body
router.post(
  "/",
  [
    Multer.single("image"), //para subir un solo archivo
    check("cuit", "el cuit es obligatorio").not().isEmpty(),
    check("name", "el nombre es obligatorio").not().isEmpty(), //no tiene que estar vacio
    check("email", "el Email es obligatorio").isEmail(),
    check("password", "el password es obligatorio").not().isEmpty(),
    check("description", "la descripcion es obligatorio").not().isEmpty(),
    check("typeEntity", "el tipoEntidad es obligatorio").not().isEmpty(),
    check("phone", "el telefono es obligatorio").not().isEmpty(),
    check("personInCharge", "el telefono es obligatorio").not().isEmpty(),
    check("lat", "La latitud es obligatoria").optional(),
    check("lng", "La longitud es obligatoria").optional(),
    check("howToGet", "La longitud es obligatoria").optional(),
    check("cbu", "La longitud es obligatoria").optional(),
    check("alias", "La longitud es obligatoria").optional(),

    validarCampos, //tiene que ser el ultimo  campo, sino no se activan
  ],
  crearOrganizacion
);
// crearUsuario)

//obtener todas las organizaciones
router.get(
  "/",
  [
    // validarJWt
  ],
  getOrganizaciones
);

//donations
router.get(
  "/donation/:id",
  [

    validarJWt

  ],
  getDonations
);

router.post(
  "/donation/:id",
  [
    check("title", "El Titulo es obligatorio").not().isEmpty(),
    check("description", "La descripcion es obligatoria").not().isEmpty(),
    check("typeDonation", "el telefono es obligatorio").not().isEmpty(),

    validarJWt

  ],
  postDonations
);




router.put("/actualizarRolOng/:id",
[
  check("permissions", "La descripcion es obligatoria").not().isEmpty(),
  

],
actualizarRolOng)

router.put(
  "/donation/changeState/:organizacionId/:donacionId",
  [
    check("nuevoEstado", "El Estado es obligatorio").optional(),
    check("title", "El Titulo es obligatorio").optional(),
    check("description", "La descripcion es obligatoria").optional(),
    check("typeDonation", "el telefono es obligatorio").optional(),
 
    validarJWt
  ],
  changeState
);




router.get(
  "/organizationEvents/:id",
  [
    validarJWt
  ],
  getOrganizationEvents
);


router.get(
  "/getOrganizationsApprove",
  [
   
  ],
  getOrganizationsApprove

);

// router.put(
//   "/rol/:id",
//   [
//     //  validarJWt(),
//     // se podria validar tambien que el que lo cambie sea un usuario
//     check("permissions", "Los permisos son obligatorios").not().isEmpty(),
//   ],
//   actualizarRolOng
// );

router.put(
  "/:id",
  [
    Multer.single("img"),
    validarJWt,
    // se podria validar tambien que el que lo cambie sea un usuario
    // check('permissions', 'Los permisos son obligatorios').not().isEmpty(),
    // Multer.single("image"), //para subir un solo archivo
  ],
  actualizarOrganizacion
);


router.delete(
  "/:id",
  [
   
  validarJWt
  ],
  elimiarOng
);

//busqueda de aquellas organizacion por nombre, enviada por parametro
router.get(
  "/:name",
  [
    // validarJWt,
  ],
  getOrganizacionesPorNombre
);

router.get("/id/:id", [validarJWt], getOrganizacionesPorId);

// email: {
//     type: String,
//     required: true,
//     unique: true
// },
// nombre: {
//     type: String,
//     required: true
// },

// password: {
//     type: String,
//     required: true,
// },
// descripcion: {
//     type: String,
//     required: true,
// },
// tipoEntidad: {
//     type: String,
//     required: true,
// },
// telefono: {
//     type: Number,
//     required: true,
// },
// img: {
//     type: String,
//     require:false,
//     default:''
// },
// ubicacion: {
//     type: String,
//     required: true,
//     default: '{TODO}'
// },
// permisos: {
//     type: String,
//     required: true,
//     default: ''
// },

module.exports = router;