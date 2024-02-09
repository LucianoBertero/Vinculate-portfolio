const { response } = require("express");
const Evento = require("../models/evento");
const Organizacion = require("../models/organizacion");
const Subscription = require("../models/subscription");

const { obtenerEventosActivos } = require("../automaticProcesses/automatic");
const Usuario = require("../models/usuario");

const crearEvento = async (req, res = response) => {
  console.log(req.body);

  const uid = req.params.id;
  try {
    const { name } = req.body;
    console.log("Creo el evento");

    const organizacionDB = await Organizacion.findById(uid).populate("events");

    if (!organizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una organizacion con ese id",
      });
    }

    //verificar que no hay un evento con el mismo nombre en el mismo tiempo
    const eventos = organizacionDB.events;
    const { startDate, endDate, startTime, endTime } = req.body;

    let superpuesto = false;

    eventos.forEach((eventoExistente) => {
      if (name === eventoExistente.name) {
        const startExistente = new Date(eventoExistente.startDate);
        const endExistente = new Date(eventoExistente.endDate);
        const startNuevo = new Date(startDate);
        const endNuevo = new Date(endDate);

        if (startNuevo.getTime() === endExistente.getTime()) {
          // El nuevo evento comienza en el mismo día que el evento existente termina
          if (startTime <= eventoExistente.endTime) {
            superpuesto = true;
          }
        } else if (
          (startNuevo > startExistente && startNuevo < endExistente) ||
          (endNuevo > startExistente && endNuevo < endExistente) ||
          (startNuevo <= startExistente && endNuevo >= endExistente)
        ) {
          superpuesto = true;
        }
      }
    });

    if (superpuesto) {
      return res.status(400).json({
        ok: false,
        msg: "El nuevo evento se superpone con otros eventos existentes",
      });
    }

    //verificar que no exista un evento con el mismo nombre
    // const eventos = await Evento.find({ name: name });
    // console.log("🚀 ~ file: evento.js:37 ~ crearEvento ~ eventos:", eventos);

    // if (eventos.length > 0) {
    //   console.log("entro a evento repetido");
    //   return res.status(400).json({
    //     ok: false,
    //     msg: "Ya existe un evento con ese nombre",
    //   });
    // }

    //creamos el evento con los datos dados
    let evento = new Evento(req.body);
    evento.coordinates.lat = req.body.lat;
    evento.coordinates.lng = req.body.lng;
    //guardamos el evento en la base de datos
    try {
      await evento.save();
    } catch (err) {
      res.status(500).json({
        ok: false,
        msg: "Hable con el admistrador",
      });
    }

    //asociamos el evento a la organizacion que lo creo
    organizacionDB.events.push(evento); // Agregar el evento al array de eventos de la organización
    //guardamos la organizacion con el evento creado
    await organizacionDB.save();

    obtenerEventosActivos();

    res.json({
      ok: true,
      msg: "Evento creado satisfactoriamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error.msg,
    });
  }
};

const getEventById = async (req, res = response) => {
  try {
    const uid = req.params.id;
    const eventFound = await Evento.findOne({ _id: uid });

    if (eventFound) {
      // El documento fue encontrado
      return res.json({
        ok: true,
        event: eventFound, // Cambié EventBD a eventFound para usar el objeto encontrado
      });
    } else {
      return res.json({
        ok: false,
        msg: "Evento no encontrado",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
      error,
    });
  }
};

const listarVoluntariosInscritos = async (req, res) => {
  try {
    const eventoId = req.params.eventoId; // Obtener el ID del evento de los parámetros

    // Buscar el evento por su ID
    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado.",
      });
    }

    // Obtener la lista de suscripciones para este evento
    const subscriptions = await Subscription.find({ event: eventoId }).populate(
      "user"
    );

    // Crear un arreglo para almacenar la información de los usuarios suscritos
    const usersSubscribed = [];

    // Iterar a través de las suscripciones y obtener la información del usuario
    for (const subscription of subscriptions) {
      if (subscription.user) {
        usersSubscribed.push({
          userId: subscription.user._id,
          userName: subscription.user.name,
          userEmail: subscription.user.email,
          // AgregaR más campos de usuario si es necesario
        });
      }
    }

    return res.json({
      ok: true,
      usersSubscribed,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const getEvents = async (req, res = response) => {
  try {
    const eventos = await Evento.find();

    if (eventos.length > 0) {
      return res.json({
        ok: true,
        eventos: eventos,
      });
    } else {
      return res.json({
        ok: false,
        msg: "No se encontraron eventos",
      });
    }
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
      error,
    });
  }
};

const eliminarEvento = async (req, res = response) => {
  try {
    const { idEvent } = req.body;
    const eventFound = await Evento.findOne({ _id: idEvent });

    if (!eventFound) {
      return res.status(404).json({
        ok: false,
        msg: "No se encontró el evento",
      });
    }

    const subscriberIds = eventFound.subscribers;
    // Inicializar un array para almacenar los objetos Subscription
    const subscriptions = [];
    // Bucle a través de los IDs y buscar los objetos Subscription
    for (const subscriberId of subscriberIds) {
      const subscription = await Subscription.find({ _id: subscriberId });
      if (subscription) {
        subscriptions.push(subscription);
      }
    }

    const userId = [];

    for (const subscriberId of subscriptions) {
      //borramos Subscripciones
      const subscription = await Subscription.findById(subscriberId);

      if (!subscription) {
        console.error(`Suscripción no encontrada: ${subscriberId}`);
        continue;
      }

      console.log(
        "🚀 ~ file: evento.js:259 ~ eliminarEvento ~ subscriberId:",
        subscriberId[0]._id.toString()
      );
      const user = await Usuario.findOne({
        _id: subscriberId[0].user.toString(),
      });

      if (user) {
        console.log("🚀 ~ file: evento.js:263 ~ eliminarEvento ~ user:", user);
        userId.push(user);
        const subscriptionIndex = user.subscriptions.findIndex((subscription) =>
          subscription.equals(subscriberId[0]._id.toString())
        );

        user.subscriptions.splice(subscriptionIndex, 1);
        await user.save();
        console.log("🚀 ~ file: evento.js:290 ~ eliminarEvento ~ user:", user); //  await user.save();
      }
      await Subscription.findByIdAndDelete(subscriberId);
    }


    

 
    await Evento.findByIdAndDelete({ _id: idEvent });

  
    return res.json({
      ok: true,
      msg: "Se elimino el evento Satisfactoriamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
      error,
    });
  }
};

module.exports = {
  crearEvento,
  getEventById,
  getEvents,
  listarVoluntariosInscritos,
  eliminarEvento,
};
