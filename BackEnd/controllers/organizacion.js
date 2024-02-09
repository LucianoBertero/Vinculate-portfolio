//TODO: solo  esta la creacion de la organizacion pelada, hay que cambiarle los permisos, fijarse si en el login es organizacion o usuario
//  hacer la api para dar de alta a la ong pero que el que lo hace tenga permisos de administrador

const Evento = require("../models/evento");
const Organizacion = require("../models/organizacion");
const bcrypt = require("bcryptjs"); //libreria para encriptar la contraseña del usuario, importada con npm i bcryptjs
const { generarJWT } = require("../helpers/jwt");
const { response } = require("express");
const { validationResult } = require("express-validator");
const { uploadImageOng, deleteImg } = require("../services/firebase");
const { async } = require("@firebase/util");
const Donation = require("../models/donacion");
const getOrganizaciones = async (req, res = response) => {
  try {
    const organizaciones = await Organizacion.find({
   
      permissions: "APPROVED", // Agregar esta condición
    });
    res.json({
      ok: true,
      organizaciones,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error inesperado",
    });
  }
};

const getOrganizacionesPorId = async (req, res = response) => {
  try {
    const uid = req.params.id;
    const organizacion = await Organizacion.findById(uid);
    res.json({
      ok: true,
      organizacion,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error inesperado",
    });
  }
};

const crearOrganizacion = async (req, res = response) => {
  try {
    const { email, name, password, lat, lng,howToGet } = req.body;

    const { firebaseUrl } = req.file;
    req.body.img = firebaseUrl;

    const existeEmail = await Organizacion.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "El email ya está registrado",
      });
    }

    const existeNombre = await Organizacion.findOne({ name });

    if (existeNombre) {
      return res.status(400).json({
        ok: false,
        msg: "El nombre ya está registrado",
      });
    }

    req.body.img = await uploadImageOng(req); // Aquí tuvimos que crear una promesa para que espere a la función

    const organizacion = new Organizacion(req.body);

    // Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    organizacion.password = bcrypt.hashSync(password, salt);

    // Si se proporcionaron latitud y longitud, incluirlas en la organización
    if (lat && lng) {
    
      organizacion.coordinates = { lat, lng };
    }else{
      organizacion.coordinates = { lat:0, lng:0 };
    }
    if(howToGet!=''){
      organizacion.howToGet=howToGet;
    }
 
    // Guardar Organización

    await organizacion.save();

    res.json({
      ok: true,
      organizacion,
      msg: "Organización creada correctamente, en los siguientes días se confirmará su cuenta",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
    });
    console.log("error" + error);
  }
};


const elimiarOng = async (req, res = response) => {
  //VERIFICAR SI SE BORRAN LOS EVENTOS SI LOS TIENE CREADO
  try {
    const uid = req.params.id;
    const existeOng = await Organizacion.findById(uid).populate("events");

    //en caso de que no exista la ONG
    if (!existeOng) {
      return res.status(500).json({
        ok: false,
        msg: "La organizacion no fue encontrada",
      });
    }

    const eventosAEliminar = existeOng.events;

    if (eventosAEliminar && eventosAEliminar.length > 0) {
      for (const eventoId of eventosAEliminar) {
        await Evento.deleteOne({ _id: eventoId });
      }
    }

    await Organizacion.deleteOne({ uid: this.uid });
    await deleteImg(existeOng.img);

    res.json({
      ok: true,
      msg: "Organizacion eliminada satisfactoriamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "algo salio mal",
    });
  }
};

const actualizarRolOng = async (req, res = response) => {
  //DEFINIR LOS PERMISOS POSIBLES EN EL FRONTEND

  console.log("Entro")
  const uid = req.params.id; //parametro mandado por por id en la url

  try {
    if (
      req.body.permissions !== "APPROVED" &&
      req.body.permissions !== "REFUSED" &&
      req.body.permissions !== "EARRING"
    ) {
      return res.status(400).json({
        ok: false,
        msg: "El permiso no es valido",
      });
    }

    const organizacionDB = await Organizacion.findById(uid);


    if (!organizacionDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe una organizacion con ese id",
      });
    }

    const permisos = { permissions: req.body.permissions };
    
    console.log("🚀 ~ file: organizacion.js:177 ~ actualizarRolOng ~ permisos:", permisos)
   
    console.log("asta aca")
    const ongActualizada = await Organizacion.findByIdAndUpdate(uid, permisos, {
      new: true,
    }); //new true es para que devuelva el objeto actualizado

    console.log("Aca no ")
    res.json({
      ok: true,
      ongActualizada,
      msg: "Rol actualizado correctamente",
      ongActualizada,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
      msg: "Error inesperado",
    });
  }
};


const getOrganizationEvents = async (req, res = response) => {
  try {
    const uid = req.params.id;
    const organizacion = await Organizacion.findById(uid).populate("events");

    // Obtener la fecha actual
 

    // Crear una nueva matriz de eventos con la propiedad "estado" agregada
    const eventosConEstado = organizacion.events.map((evento) => {    

      return {
        ...evento.toObject(), // Convertir el objeto Mongoose a un objeto JavaScript plano
       
      };
    });

    return res.json({
      ok: true,
      eventos: eventosConEstado, // Los eventos con la propiedad "estado" agregada
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};


const getOrganizacionesPorNombre = async (req, res = response) => {
  const busqueda = req.params.name;

  const regex = new RegExp(busqueda, "i"); //la i es para que no sea case sensitive

  try {
    const organizaciones = await Organizacion.find({ name: regex });

    res.json({
      ok: true,
      organizaciones,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};

// Método para modificar una organización y guardarla en MongoDB
const actualizarOrganizacion = async (req, res = response) => {
  const { id } = req.params;
  const {
    email,
    name,
    description,
    personInCharge,
    typeEntity,
    phone,
    location,
    cuit,
  } = req.body;

  console.log(req.file);

  try {
    const organizacion = await Organizacion.findById(id);

    const nombreExistente = await Organizacion.findOne({ name: name });
    const emailExistente = await Organizacion.findOne({ email: email });

    if (!organizacion) {
      return res.status(500).json({
        ok: false,
        msg: "Organización no encontrada",
      });
    }

    if (
      nombreExistente &&
      nombreExistente._id.toString() !== organizacion._id.toString()
    ) {
      return res.status(500).json({
        ok: false,
        msg: "Nombre de organización repetido, ingrese otro",
      });
    } else if (
      emailExistente &&
      emailExistente._id.toString() !== organizacion._id.toString()
    ) {
      return res.status(500).json({
        ok: false,
        msg: "Email registrado en la base de datos, ingrese otro",
      });
    }

    let img;
    if (req.file != undefined) {
      await deleteImg(organizacion.img);

      img = await uploadImageOng(req);
    }

    const camposModificados = {
      email,
      name,
      description,
      personInCharge,
      typeEntity,
      phone,
      img,
      location,
      cuit,
    };

    console.log(img);

    // Eliminar las propiedades con valor undefined del objeto
    Object.keys(camposModificados).forEach((key) =>
      camposModificados[key] === undefined ? delete camposModificados[key] : ""
    );

    // Actualizar los campos en la organización y guardarla en MongoDB
    await Organizacion.findOneAndUpdate({ _id: id }, camposModificados);

    res.json({ message: "Organización modificada exitosamente" });
  } catch (error) {
    console.error("BIG ERRORS: ", error);
    return res
      .status(500)
      .json({ message: "Error al modificar la organización" });
  }
};




const getDonations = async (req, res = response) => {
  try {
    const { id } = req.params; // ID de la organización
    // Busca la organización por su ID y selecciona las donaciones
    const organizacion = await Organizacion.findById(id).populate('donations');

    if (!organizacion) {
      return res.status(404).json({ msg: 'Organización no encontrada.' });
    }

    const donaciones = organizacion.donations;

    res.json({ donaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las donaciones de la organización.' });
  }
};




const postDonations = async (req, res = response) => {
  try {
    const { id } = req.params; // ID de la organización a la que se asociará la donación
    const { title, description, typeDonation } = req.body; // Datos de la donación desde el cuerpo de la solicitud

    // Verifica si la organización existe
    const organizacion = await Organizacion.findById(id);

    if (!organizacion) {
      return res.status(404).json({
        ok: false,
        msg: "Organización no encontrada",
      });
    }

    const donacionExistente = organizacion.donations.find(
      (donacion) => donacion.title === title
    );

    if (donacionExistente) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una donación con este título en esta organización",
      });
    }




    if (donacionExistente) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe una donación con el mismo título en esta organización",
      });
    }
    console.log("entro hasca aca")

    // Crea una nueva donación
    const donacion = new Donation({
      title: title,
      description:description,
      typeDonation:typeDonation,
      state: "vigente", 
    });
    console.log("🚀 ~ file: organizacion.js:393 ~ postDonations ~ donacion:", donacion)

    console.log("asta aca tambien")
    // Agrega la donación a la organización
    organizacion.donations.push(donacion);

    // Guarda la organización actualizada con la donación
    await organizacion.save();

    res.json({
      ok: true,
      donacion,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }

}


const changeState = async (req, res = response) => {
  try {
    const { organizacionId, donacionId } = req.params;
    const { nuevoEstado } = req.body;
    const { title, description, typeDonation } = req.body;
    

    const organizacion = await Organizacion.findById(organizacionId);
    if (!organizacion) {
      return res.status(404).json({ ok: false, msg: 'Organización no encontrada' });
    }

    const donacion = organizacion.donations.find((don) => don._id.toString() === donacionId);
    const donacionIndex = organizacion.donations.findIndex((don) => don._id.toString() === donacionId);

    if (donacionIndex === -1) {
      return res.status(404).json({ ok: false, msg: 'Donación no encontrada' });
    }

    if (nuevoEstado === 'Eliminar') {
      // Eliminar la donación
      organizacion.donations.splice(donacionIndex, 1);
      await organizacion.save();
      return res.json({ ok: true, msg: 'Donación eliminada con éxito' });
    } else {
      // Modificar el estado de la donación
   
      if (nuevoEstado !== undefined) {
        organizacion.donations[donacionIndex].state = nuevoEstado;
      }
      
      if (title !== undefined) {
        organizacion.donations[donacionIndex].title = title;
      }
      
      if (description !== undefined) {
        organizacion.donations[donacionIndex].description = description;
      }
      
      if (typeDonation !== undefined) {
        organizacion.donations[donacionIndex].typeDonation = typeDonation;
      }

      
      await organizacion.save();
      return res.json({ ok: true, msg: 'Donación modificada con éxito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar el estado de la donación' });
  }
};






const getOrganizationsApprove = async (req, res = response) => {
  try {
    const organizaciones = await Organizacion.find({ permissions: { $ne: "APPROVED", $exists: true } });

    console.log("🚀 ~ file: organizacion.js:490 ~ getOrganizationsApprove ~ organizaciones:", organizaciones)


    res.json({
      ok: true,
      organizaciones,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};



// const getDonations = async (req, res = response) => {
//   try {
//     const { id } = req.params;
//     const organizaciones = await Organizacion.find({
   
//       permissions: "APPROVED", // Agregar esta condición
//     });
//     res.json({
//       ok: true,
//       organizaciones,
//     });
//   } catch (error) {
//     res.status(500).json({
//       ok: false,
//       msg: "error inesperado",
//     });
//   }
// };




// const postDonations = async (req, res = response) => {
//   try {
//     const { id } = req.params; // ID de la organización a la que se asociará la donación
//     const { title, description, typeDonation } = req.body; // Datos de la donación desde el cuerpo de la solicitud
//     console.log("entro al donation")
//     // Verifica si la organización existe
//     const organizacion = await Organizacion.findById(id);

//     if (!organizacion) {
//       return res.status(404).json({
//         ok: false,
//         msg: "Organización no encontrada",
//       });
//     }

//     const donacionExistente = organizacion.donations.find(
//       (donacion) => donacion.title === title
//     );

//     if (donacionExistente) {
//       return res.status(400).json({
//         ok: false,
//         msg: "Ya existe una donación con este título en esta organización",
//       });
//     }




//     if (donacionExistente) {
//       return res.status(400).json({
//         ok: false,
//         msg: "Ya existe una donación con el mismo título en esta organización",
//       });
//     }
//     console.log("entro hasca aca")

//     // Crea una nueva donación
//     const donacion = new Donations({
//       title: title,
//       description:description,
//       typeDonation:typeDonation,
//       state: "vigente", 
//     });
//     console.log("🚀 ~ file: organizacion.js:393 ~ postDonations ~ donacion:", donacion)

//     console.log("asta aca tambien")
//     // Agrega la donación a la organización
//     organizacion.donations.push(donacion);

//     // Guarda la organización actualizada con la donación
//     await organizacion.save();

//     res.json({
//       ok: true,
//       donacion,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       ok: false,
//       msg: "Error inesperado",
//     });
//   }
// };


module.exports = {
  getOrganizacionesPorId,
  crearOrganizacion,
  getOrganizaciones,
  actualizarRolOng,
  getOrganizacionesPorNombre,
  actualizarOrganizacion,
  elimiarOng,
  getOrganizationEvents,
  getDonations,
  postDonations,
  changeState,
  getOrganizationsApprove

};