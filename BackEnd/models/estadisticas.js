const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estadisticasSchema = new Schema({
    mes: {
      type: Number,
      required: true,
    },
    anio: {
      type: Number,
      required: true,
    },
    loginsPorDias: [
      {
        dia: {
          type: Number,
          required: true,
        },
        logins: {
          type: Number,
          default: 0,
        },
      },
    ],
  });

const Estadisticas = mongoose.model('Estadisticas', estadisticasSchema);

module.exports = Estadisticas;
