const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subscriptionSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', // Nombre del modelo de Usuario
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Evento', // Nombre del modelo de Evento
  },
  // Puedes agregar más campos según tus necesidades, como fecha de suscripción, estado, etc.
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;