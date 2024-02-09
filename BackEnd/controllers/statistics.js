
const Evento = require("../models/evento");
const Organizacion = require("../models/organizacion");
const Estadisticas = require('../models/estadisticas'); 
const Usuario = require("../models/usuario");
const { response } = require("express");
const { validationResult } = require("express-validator");



const getUsers = async (req, res) => {
  try {
    // Obtén la cantidad de usuarios
    const totalUsuarios = await Usuario.countDocuments();
    console.log("🚀 ~ file: statistics.js:15 ~ getUsers ~ totalUsuarios:", totalUsuarios)

    // Obtén la cantidad de organizaciones con 'permissions' igual a 'APPROVED'
    const totalOrganizacionesAprobadas = await Organizacion.countDocuments({ permissions: 'APPROVED' });
    console.log("🚀 ~ file: statistics.js:18 ~ getUsers ~ totalOrganizacionesAprobadas:", totalOrganizacionesAprobadas)
    const totalOrganizacionesNoAprobadas = await Organizacion.countDocuments({ permissions: { $ne: 'APPROVED' } });
    console.log("🚀 ~ file: statistics.js:20 ~ getUsers ~ totalOrganizacionesNoAprobadas:", totalOrganizacionesNoAprobadas)



    return res.json({
      usuarios:totalUsuarios,
      ongApproved:totalOrganizacionesAprobadas,
      ongNoApproved:totalOrganizacionesNoAprobadas
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: 'Error al obtener la información.',
    });
  }
};


// Anda bien con mes y anio



// const getPageViewStatistics = async (req, res) => {
//     try {
//         const { mes, anio } = req.body;
//         console.log("🚀 ~ file: statistics.js:111 ~ getPageViewStatistics ~ anio:", anio)

//         let matchCriteria = null; // Inicializamos el criterio de coincidencia como null

//         if (mes && anio) {
//             matchCriteria = { '_id.mes': mes, '_id.anio': anio };
//         } else if (anio) {
//             matchCriteria = { '_id.anio': anio };
//         }
        

//         const statistics = await Estadisticas.aggregate([
//             {
//                 $group: {
//                     _id: {
//                         mes: '$mes',
//                         anio: '$anio',
//                     },
//                     loginsPorDias: { $push: '$loginsPorDias' },
//                 },
//             },
//             {
//                 $match: matchCriteria,
//             },
//         ]);

//         // Inicializamos un objeto para almacenar la suma de logins por mes
//         const loginsPorMesTotales = {};

//         statistics.forEach((item) => {
//             item.loginsPorDias.forEach((loginsPorDia) => {
//                 loginsPorDia.forEach((dia) => {
//                     // Si no existe la entrada en el mes, inicialízala con 0
//                     if (!loginsPorMesTotales[item._id.mes]) {
//                         loginsPorMesTotales[item._id.mes] = 0;
//                     }
//                     loginsPorMesTotales[item._id.mes] += dia.logins;
//                 });
//             });
//         });
        
//         // Transformamos los resultados en el formato deseado
//         const series = Object.keys(loginsPorMesTotales).map((mes) => ({
//             name: `Mes ${mes}`,
//             value: loginsPorMesTotales[mes],
//         }));

//         const response = {
//             ok: true,
//             data: {
//                 series,
//             },
//             msg: 'Page view statistics retrieved successfully.',
//         };

//         res.json(response);
//     } catch (error) {
//         console.error('Error retrieving page view statistics:', error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Error retrieving page view statistics.',
//         });
//     }
// };

const getPageViewStatistics = async (req, res) => {
    try {
       
  
        const mes = parseInt(req.query.mes, 10);
        const anio = parseInt(req.query.anio, 10);
        let matchCriteria = null;

        if (mes && anio) {
            matchCriteria = { '_id.mes': mes, '_id.anio': anio };
        } else if (anio) {
            matchCriteria = { '_id.anio': anio };
        }

        const statistics = await Estadisticas.aggregate([
            {
                $group: {
                    _id: {
                        mes: '$mes',
                        anio: '$anio',
                    },
                    loginsPorDias: { $push: '$loginsPorDias' },
                },
            },
            {
                $match: matchCriteria,
            },
        ]);

        if (mes) {
            // Si se especifica un mes, devolver una serie con datos por día
            const loginsPorDiaTotales = {};

            statistics.forEach((item) => {
                item.loginsPorDias.forEach((loginsPorDia) => {
                    loginsPorDia.forEach((dia) => {
                        if (!loginsPorDiaTotales[dia.dia]) {
                            loginsPorDiaTotales[dia.dia] = 0;
                        }
                        loginsPorDiaTotales[dia.dia] += dia.logins;
                    });
                });
            });

            const series = Object.keys(loginsPorDiaTotales).map((dia) => ({
                name: `Día ${dia}`,
                value: loginsPorDiaTotales[dia],
            }));

            const response = {
                ok: true,
                data: {
                    series,
                },
                msg: 'Page view statistics retrieved successfully.',
            };

            res.json(response);
        } else {
            // Si no se especifica un mes, seguir agrupando los datos por mes
            const loginsPorMesTotales = {};

            statistics.forEach((item) => {
                item.loginsPorDias.forEach((loginsPorDia) => {
                    loginsPorDia.forEach((dia) => {
                        if (!loginsPorMesTotales[item._id.mes]) {
                            loginsPorMesTotales[item._id.mes] = 0;
                        }
                        loginsPorMesTotales[item._id.mes] += dia.logins;
                    });
                });
            });

            const series = Object.keys(loginsPorMesTotales).map((mes) => ({
                name: `Mes ${mes}`,
                value: loginsPorMesTotales[mes],
            }));

            const response = {
                ok: true,
                data: {
                    series,
                },
                msg: 'Page view statistics retrieved successfully.',
            };

            res.json(response);
        }
    } catch (error) {
        console.error('Error retrieving page view statistics:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error retrieving page view statistics.',
        });
    }
};






module.exports = {
    getUsers,getPageViewStatistics
  };
  