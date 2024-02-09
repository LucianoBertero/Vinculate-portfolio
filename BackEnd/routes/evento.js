const { Router } = require("express");
const { check } = require("express-validator"); //validadores
const { validarCampos } = require("../middlewares/validar-campos"); //validadores

const { crearEvento, getEventById,getEvents, listarVoluntariosInscritos,  eliminarEvento } = require("../controllers/evento");

const { validarJWt } = require("../middlewares/validar-jwt");

const router = Router();

//para crear un usuario
router.post(
  "/:id",
  [
    validarJWt,
    check("name", "El nombre es obligatorio").notEmpty(),
    check("category", "La categoria es obligatoria").notEmpty(),
    check("startDate", "Fecha de inicio es obligatoria").notEmpty(),
    check("startTime", "La fecha del evento es obligatoria").notEmpty(),
    check(
      "endTime",
      "El horario de cierre del evento es obligatorio"
    ).notEmpty(),
    check("endDate", "La fecha de cierre del evento es obligatorio").notEmpty(),

    check(
      "description",
      "La descripcion del evento son obligatorias"
    ).notEmpty(),
    check(
      "requirements",
      "Los requerimientos de la organizacion son obligatorios"
    ).notEmpty(),
    check("lat", "La latitud es obligatoria").notEmpty(),
    check("lng", "La longitud es obligatoria").notEmpty(),
    check(
      "howToGet",
      "La descripcion de como llegar es obligatoria"
    ).notEmpty(),
    check("maxPeople", "La cantidad de personas es necesaria").notEmpty(),

    validarCampos,
  ],
  crearEvento
);

router.get("/:id", [validarJWt], getEventById);


router.get("/", [validarJWt], getEvents);


// router.get(
//   "/:organizacionId/:eventoId/voluntarios",
//   listarVoluntariosInscritos
// );


router.get(
  "/:eventoId/voluntarios",
  listarVoluntariosInscritos
);
router.delete(
  "/eliminarEvento",
  [check("idEvent", "La longitud es obligatoria").notEmpty()],
  eliminarEvento
);
module.exports = router;
