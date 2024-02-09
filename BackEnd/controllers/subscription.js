const { response } = require("express");
const Usuario = require("../models/usuario");
const Evento = require("../models/evento");
const Subscription = require("../models/subscription");
const usuario = require("../models/usuario");
const mongoose = require("mongoose");

const { Types } = require("mongoose");
const ObjectId = Types.ObjectId; // Importa ObjectId y asigna Types.ObjectId a una variable

const subscribe = async (req, res) => {
  try {
    const eventoId = req.body.eventId;
    console.log("🚀 ~ file: subscription.js:14 ~ subscribe ~ eventoId:", eventoId)
    const usuarioId = req.params.id;

    const evento = await Evento.findById(eventoId);

    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no encontrado.",
      });
    }

    if (evento.state !== "Proximo a comenzar") {
      return res.status(400).json({
        ok: false,
        msg: "No puedes suscribirte a este evento en su estado actual.",
      });
    }

    const existingSubscription = await Subscription.findOne({
      user: usuarioId,
      event: eventoId,
    });

    if (existingSubscription) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya está suscrito a este evento.",
      });
    }

    if (evento.maxPeople && evento.subscribers.length >= evento.maxPeople - 1) {
      return res.status(400).json({
        ok: false,
        msg: "No hay cupos disponibles para este evento.",
      });
    }

    // Crear una nueva suscripción
    const newSubscription = new Subscription({
      user: usuarioId,
      event: eventoId,
    });

    await newSubscription.save();

    // Incrementar el contador de suscripciones en el evento
    evento.subscribers.push(newSubscription);
    evento.markModified("subscribers"); // Asegurar que se detecten los cambios en el array

    evento.subscription = evento.subscribers.length; // Incrementa el contador

    await evento.save();

    const usuario = await Usuario.findById(usuarioId);
    usuario.subscriptions.push(newSubscription);
    await usuario.save();

    return res.json({
      ok: true,
      msg: "Suscrito exitosamente al evento.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { usuarioId } = req.usuario;
    await Subscription.findOneAndRemove({
      usuario: usuarioId,
      evento: eventoId,
    });

    res.json({ msg: "Se ha cancelado la suscripción al evento." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error al cancelar la suscripción al evento." });
  }
};

const getUserSubscriptions = async (req, res) => {
  try {
    const usuarioId = req.params.id;

    const usuario = await Usuario.findById(usuarioId);

    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    const subscriptions = await Subscription.find({ user: usuarioId }).populate(
      "event"
    );

    res.json({ subscriptions });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error al obtener las suscripciones del usuario." });
  }
};

const deleteSubscription = async (req, res) => {

  try {
    const usuarioId = req.params.id;
    console.log("🚀 ~ file: subscription.js:129 ~ deleteSubscription ~ usuarioId:", usuarioId)
    const eventId = req.params.eventId;
    console.log("🚀 ~ file: subscription.js:130 ~ deleteSubscription ~ eventId:", eventId)
    const subscriptionId = req.params.subscription;
    console.log("🚀 ~ file: subscription.js:131 ~ deleteSubscription ~ subscriptionId:", subscriptionId)

    // Verifica si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
   
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    // Convierte el eventId a un ObjectId
    const eventIdObject = new ObjectId(subscriptionId); // Utiliza new para crear un ObjectId

    // Busca el índice de la suscripción en la matriz de suscripciones del usuario
    const subscriptionIndex = usuario.subscriptions.findIndex((subscription) =>
      subscription.equals(subscriptionId)
    );

    // Si no se encuentra la suscripción, devuelve un error
    if (subscriptionIndex === -1) {
      return res.status(404).json({ msg: "Suscripción no encontrada." });
    }

    // Elimina la suscripción de la matriz de suscripciones del usuario
    usuario.subscriptions.splice(subscriptionIndex, 1);

    // Reemplaza con el ID de evento válido

    const usuarioIdObject = ObjectId.isValid(usuarioId)
      ? new ObjectId(usuarioId)
      : null;

    const eventIdObjects = ObjectId.isValid(eventId)
      ? new ObjectId(eventId)
      : null;

    user = new ObjectId(usuarioId);

    const subscription = await Subscription.findOne({
      user: usuarioIdObject,
      event: eventIdObjects,
    });

    const evento = await Evento.findById(eventId);

    if (!evento) {
      return res.status(404).json({ msg: "Evento no encontrado." });
    }

    const subscriptionIndexEvent = evento.subscribers.findIndex(
      (subscription) => subscription.equals(subscriptionId)
    );
    console.log("🚀 ~ file: subscription.js:181 ~ deleteSubscription ~ subscriptionIndexEvent:", subscriptionIndexEvent)

    // Si no se encuentra la suscripción, devuelve un error
    if (subscriptionIndexEvent === -1) {
      return res.status(404).json({ msg: "Suscripción no encontrada." });
    }

    // Elimina la suscripción de la matriz de suscripciones del usuario
    evento.subscribers.splice(subscriptionIndexEvent, 1);
    if (evento.subscription > 0) {
      evento.subscription -= 1;
    }

    // Elimina la suscripción de la colección de suscripciones
    const deletedSubscription = await Subscription.findByIdAndRemove(
      subscriptionId
    );

    if (!deletedSubscription) {
      return res.status(404).json({ msg: "Suscripción no encontrada." });
    }

    await usuario.save();

    await evento.save();

    return res.json({
      ok: true,
      msg: "Suscripción eliminada con éxito.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Error inesperado... revisar logs",
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getUserSubscriptions,
  deleteSubscription,
};
