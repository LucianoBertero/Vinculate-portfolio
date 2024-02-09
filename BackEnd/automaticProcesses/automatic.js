
const cron = require("node-cron");
const Evento = require("../models/evento");

// const actualizarEstadoEvento = async (evento) => {
//   const ahora = new Date();
//   const fechaInicio = new Date(evento.startDate);
//   const fechaFinalizacion = new Date(evento.endDate);

//   let nuevoEstado;

//   if (ahora > fechaFinalizacion) {
//     nuevoEstado = 'Finalizado';
//   } else if (ahora >= fechaInicio) {
//     nuevoEstado = 'En curso';
//   } else {
//     nuevoEstado = 'Proximo a comenzar';
//   }

//   if (evento.state !== nuevoEstado) {
//     evento.state = nuevoEstado;
//     await evento.save(); // Solo guardar si el estado ha cambiado
//   }
// };

// // '*/5 * * * *'

//   const actualizarEvento = async (evento) => {
//     cron.schedule('*/5 * * * *', async () => {
//       try {
//         const eventos = await Evento.find(); // Obtener todos los eventos

//         for (const evento of eventos) {
//           await actualizarEstadoEvento(evento); // Actualizar el estado de cada evento
//         }

//         console.log('Estados de eventos actualizados con éxito.');
//       } catch (error) {
//         console.error('Error al actualizar estados de eventos:', error);
//       }

//       console.log("ejecutando")
//     });// Guardar el evento actualizado en la base de datos
//   };

// Esta variable almacenará los eventos activos
let eventosActivos = [];

// Función para obtener los eventos activos
const obtenerEventosActivos = async () => {
  const fechaActual = new Date();
  fechaActual.setUTCHours(3, 0, 0, 0); // Establece los segundos y milisegundos a ceros
  const ahora = fechaActual.toISOString();




 
  // Convierte la fecha en una cadena de texto
 

  // Utiliza una expresión regular para ajustar la cadena de fecha
  // var ahora = fechaActualString.replace(
  //   /T\d{2}:\d{2}:\d{2}.\d{3}Z$/,
  //   "T03:00:00.000+00:00"
  // );




  eventosActivos = await Evento.find({
    $or: [
      {
        $and: [
          { state: "EnCurso" },
       // Fecha de inicio menor o igual a la actual
          { endDate: { $gte: ahora } },   // Fecha de finalización mayor o igual a la actual
        ],
      },
      {
        $and: [
          { state: "Proximo a comenzar" },
          { startDate: { $lte: ahora } }, // Fecha de inicio menor o igual a la actual
        ],
      },
    ],
  });

};

// Función para actualizar los estados de los eventos activos
const actualizarEstadoEventos = async () => {
  try {
 
    const ahora = new Date();
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes(); // Convertir hora actual a minutos desde la medianoche

    for (const evento of eventosActivos) {
      const horaInicio = convertirHoraAMinutos(evento.startTime); // Obtener hora de inicio como arreglo [horas, minutos]

      const horaFin = convertirHoraAMinutos(evento.endTime); // Obtener hora de fin como arreglo [horas, minutos]

      if (evento.state === "Proximo a comenzar" && horaInicio < horaActual) {
        evento.state = "EnCurso";
        await evento.save(); // Guardar el evento actualizado en la base de datos
        console.log('Estado de evento actualizado a "En curso".');
      }

      // Verificar si el evento es "En curso" y la hora de finalización es menor que la actual
      if (evento.state === "EnCurso" && horaFin < horaActual) {
        evento.state = "Finalizado";
        await evento.save(); // Guardar el evento actualizado en la base de datos
        console.log('Estado de evento actualizado a "Finalizado".');
      }
    }
  } catch (error) {
    console.error("Error al actualizar estados de eventos:", error);
  }
};

convertirHoraAMinutos = (horaEnFormatoHHMM) => {
  const partes = horaEnFormatoHHMM.split(":").map(Number);
  if (partes.length === 2) {
    const horas = partes[0];
    const minutos = partes[1];
    return horas * 60 + minutos;
  }
  return 0; // En caso de formato inválido, devolvemos 0 minutos
};

// Llamar a la función para obtener eventos activos al inicio

// Configurar la tarea programada para verificar estados cada 5 minutos

module.exports = {
  actualizarEstadoEventos,
  obtenerEventosActivos,


};
