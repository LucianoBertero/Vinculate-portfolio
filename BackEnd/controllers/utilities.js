const Usuario = require("../models/usuario");
const Event = require("../models/evento");
const bcrypt = require("bcryptjs"); //libreria para encriptar la contraseña del usuario, importada con npm i bcryptjs
const Organizacion = require("../models/organizacion");
const { response } = require("express");
const Estadisticas = require('../models/estadisticas')
//const moment = require("moment");
const changePassword = async (req, res = response) => {
  const uid = req.uid;
  const { oldPassword, newPassword } = req.body;
  try {
    const organizacionDB = await Organizacion.findById(uid);

    const usuarioDB = await Usuario.findById(uid);
    let userInSession;

    if (usuarioDB) {
      userInSession = usuarioDB;
    } else if (organizacionDB) {
      userInSession = organizacionDB;
    } else {
      // Aquí puedes manejar el caso en el que no se encuentra ninguno de los dos documentos
      return res.status(400).json({
        ok: false,
        msg: "Usuario no encontrado",
      });
    }
    console.log(
      "🚀 ~ file: utilities.js:21 ~ changePassword ~ userInSession:",
      userInSession
    );

    const validPassword = bcrypt.compareSync(
      oldPassword,
      userInSession.password
    );

    if (!validPassword) {
      // La contraseña no es válida, puedes continuar con el flujo de tu aplicación.
      return res.status(400).json({
        ok: false,
        msg: "La contraseña ingresada no coincide con la actual",
      });
    }
    const salt = bcrypt.genSaltSync();
    userInSession.password = bcrypt.hashSync(newPassword, salt);

    await userInSession.save();

    return res.json({
      ok: true,
      msg: "Contraseña cambiada satisfactoriamente",
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "Hable con el administrador",
      msge: error,
    });
  }
};

const getMapCoordinatesEvent = async (req, res = response) => {
  try {
    const organizationsWithEvents = await Organizacion.find().populate(
      "events"
    );

    const fechaActual = new Date();

    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, "0"); // Agrega un 0 al principio si el mes es menor a 10
    const día = String(fechaActual.getDate()).padStart(2, "0"); // Agrega un 0 al principio si el día es menor a 10

    const fechaLimite = `${año}-${mes}-${día}`;

    // Crear un objeto para almacenar los eventos separados por organización
    const eventosPorOrganizacion = {};

    // Recorrer las organizaciones y sus eventos
    for (const organization of organizationsWithEvents) {
      const eventosFiltrados = organization.events.filter((evento) => {
        const fecha = new Date(evento.startDate);
        const aaaa = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, "0"); // Sumamos 1 al mes porque en JavaScript los meses van de 0 a 11
        const dd = String(fecha.getDate()).padStart(2, "0");
        const fechaFormateada = `${aaaa}-${mm}-${dd}`;

        return fechaFormateada > fechaLimite;
      });

      // Agregar el evento solo si la organización tiene eventos
      if (eventosFiltrados.length > 0) {
        eventosPorOrganizacion[organization.name] = eventosFiltrados;
      }
    }

    // Obtener la lista de organizaciones sin eventos
    const organizaciones = organizationsWithEvents.map((organization) => ({
      _id: organization._id,
      name: organization.name,
      img: organization.img,

      typeEntity: organization.typeEntity,

      // Agrega otros campos de organización aquí si es necesario
    }));

    res.json({
      organizaciones,
      eventosPorOrganizacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};



const getMapCoordinatesOng = async (req, res = response) => {
  try {
    const organizationsWithCoordinates = await Organizacion.find({
      coordinates: { $exists: true, $ne: null },
      permissions: "APPROVED",
    });


    

    res.json({
      ok:true,
      organizationsWithCoordinates,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};



module.exports = {
  changePassword,
  getMapCoordinatesEvent,
  getMapCoordinatesOng
};
