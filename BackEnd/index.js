require("dotenv").config();
const express = require("express");
const { dbconection } = require("./database/config");
const cors = require("cors");
const cron = require('node-cron');
const app = express();
app.use(cors());
//Carpeta publica

app.use(express.static("public"));
app.use(express.json());
//rutas
app.use("/api/login", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/organizacion", require("./routes/organizacion"));
app.use("/api/utilities", require("./routes/utilities"));
app.use("/api/evento", require("./routes/evento"));
app.use("/api/subscription", require("./routes/subscription"));
app.use("/api/statistics", require("./routes/statistics"));
const {
  actualizarEstadoEventos, obtenerEventosActivos
} = require("./automaticProcesses/automatic.js");







const horaEjecucion = '0 1 * * *';


const { actualizarEvento } = require("./automaticProcesses/automatic.js");



//base de datos
dbconection();

app.listen(process.env.PORT, () => {


    //proceso que se realiza cada 5 minutos para cambiarle el estado a los eventos 
    obtenerEventosActivos()
    cron.schedule(horaEjecucion, async () => {
      console.log('Ejecutando obtenerEventosActivos al comienzo del día...');
      await obtenerEventosActivos();
    });

    cron.schedule('* * * * *', async () => {
      await actualizarEstadoEventos();
    });



  console.log("server is running on port " + process.env.PORT);
});

//mongoose, bcrypt, express-validator, jsonwebtoken, dotenv, cors, express, nodemon, app de google

// const actualizarEstadoEvento = async (evento) => {
//   const ahora = new Date();
//   const fechaInicio = new Date(evento.startDate);
//   const fechaFinalizacion = new Date(evento.endDate);
// console.log(evento.state)
//   if (ahora > fechaFinalizacion) {
//     evento.state = 'Finalizado';
//   } else if (ahora >= fechaInicio) {
//     evento.state = 'EnCurso';

//   } else {
//     evento.state = 'Vigente';
//   }

//   await evento.save(); // Guardar el evento actualizado en la base de datos
// };

// const actualizarEvento = async (evento) => {
//   cron.schedule('*/30 * * * * *', async () => {
//     try {
//       const eventos = await Evento.find(); // Obtener todos los eventos

//       for (const evento of eventos) {
//         await actualizarEstadoEvento(evento); // Actualizar el estado de cada evento
//       }

//       console.log('Estados de eventos actualizados con éxito.');
//     } catch (error) {
//       console.error('Error al actualizar estados de eventos:', error);
//     }

//     console.log("ejecutando")
//   });// Guardar el evento actualizado en la base de datos
// };
