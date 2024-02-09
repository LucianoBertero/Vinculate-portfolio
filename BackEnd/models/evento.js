const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');


const Evento = Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
      },
      message: "El formato de la hora de inicio es inválido",
    },
  },
  endTime: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Validación personalizada para verificar el formato de hora
        // Puedes ajustar esta validación según tus requisitos
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value);
      },
      message: "El formato de la hora de fin es inválido",
    },
  },
  endDate: {
    type: Date, //verificar bien si es string o otro tipo de
    required: true,
  },

  coordinates: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: String,
      required: true,
    },
    maxPeople: {
      type: Number,
    },

    subscription: {
        type: Number,
        
    },
    howToGet: {
      type: String,
      require: true,
    },
  
   
    state: {
        type: String,
        default: 'Proximo a comenzar'
    },
    subscribers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subscription',
        },
      ],
  
    
});

Evento.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object
})

 

module.exports = model( 'Evento', Evento );
