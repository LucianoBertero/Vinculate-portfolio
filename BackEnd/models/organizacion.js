const { Schema, model } = require('mongoose');
const Donacion = require('./donacion'); // Importa el modelo de Donacion
const mongoose = require('mongoose');


const Organizacion = Schema({

    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },  
   
    password: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    personInCharge: {
        type: String,
        required: true,
    },
    typeEntity: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    cuit: {
        type: Number,
        required: true,
    },
    cbu: {
        type: Number,
        required: false,
    },
    alias: {
        type: String,
        required: false,
    },
    img: {
        type: String,
        require:false,
        default:''
    },
    location: {
        type: String,
        required: true,
        default: '{TODO}'
    },
    role: {
        type: String,
        required: true,
        default: 'ONG_ROLE'
    },    
    permissions: {
        type: String,
        required: true,
        default: 'earring'
    },
    coordinates: {
        lat: {
            type: Number,
            required: false,
        },
        lng: {
            type: Number,
            required: false,
        },
    },
    howToGet:{
        type: String,
        require:false
    },
    donations: [Donacion.schema],

    events: {
        type: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Evento'
        }],
        default: []
      }
    
});

Organizacion.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object
})



module.exports = model( 'Organizacion', Organizacion );





//TODO ver que onda lo de persona responsable