const Usuario = require("../models/usuario");
const bcrypt = require("bcryptjs"); //libreria para encriptar la contraseña del usuario, importada con npm i bcryptjs
const { generarJWT } = require("../helpers/jwt");
const { response } = require("express");
const { validationResult } = require("express-validator");
const { async } = require("@firebase/util");

const crearUsuario = async (req, res = response) => {
  //desestructuracion de los campos del body
  // extraemos valores para verificar posteriormente
  const { email, password, name } = req.body;

  try {
    //verificar si el email existe, si no existe el mismo tirara error
    const existeEmail = await Usuario.findOne({ email });
    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "el correo ya esta registrado",
      });
    }
    //aca como existe y paso el try se devuelve el usuario
    const usuario = new Usuario(req.body);
    //encruptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    uid = req.uid;
    const token = await generarJWT(uid);
    //guardarlo en la base de datos
    await usuario.save();
    //respuesta al put
    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      ok: false,
      msg: "error inesperado... revisar logs",
    });
  }
};

const getUsuarios = async (req, res = response) => {
  try {
    const usuarios = await Usuario.find();
    res.json({
      ok: true,
      usuarios,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error inesperado",
    });
  }
};

const getUsuarioId = async (req, res = response) => {
  try {
    const uid = req.params.id;
    const usuario = await Usuario.findById(uid);
    res.json({
      ok: true,
      usuario,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error inesperado",
    });
  }
};

// Agrego josé (Eliminacion de Usuario fisico de Isa)

const eliminarVoluntario = async (req, res = response) => {
  const uid = req.params.id; //parametro mandado por por id en la url

  try {
    try {
      const voluntarioDB = await Usuario.findById(uid);
    } catch {
      return res.status(404).json({
        ok: false,
        msg: "No existe un voluntario con ese id",
      });
    }

    //

    const voluntarioEliminado = await Usuario.findByIdAndDelete(uid, {
      new: true,
    }); //new true es para que devuelva el objeto actualizado

    res.json({
      ok: true,
      voluntarioEliminado,
      msg: "voluntario eliminado correctamente",
      voluntarioEliminado,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: error,
      msg: "Error inesperado",
    });
  }
};

// Dejo de agregar

// Agregó José (Método para modificar el password de un voluntario y guardarlo en MongoDB)
const actualizarPassword = async (req, res = response) => {
  const { id } = req.params;
  const { passwordActual, nuevoPassword } = req.body;

  try {
    const voluntario = await Usuario.findById(id);

    if (!voluntario) {
      return res.status(500).json({
        ok: false,
        msg: "Voluntario no encontrado",
      });
    }

    // Verificar si el password actual coincide con el almacenado en la base de datos
    if (!bcrypt.compareSync(passwordActual, voluntario.password)) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña actual no coincide",
      });
    }

    // Encriptar el nuevo password
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(nuevoPassword, salt);

    voluntario.password = hashedPassword;

    // Actualizar el password del voluntario y guardarlo en MongoDB
    await voluntario.save();

    res.json({ message: "Password modificado exitosamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error al modificar el password" });
  }
};

// Dejó de agregar

// Agrego Jose :)

const getVoluntarioPorNombre = async (req, res = response) => {
  const busqueda = req.params.name;

  const regex = new RegExp(busqueda, "i"); //la i es para que no sea case sensitive

  try {
    const voluntario = await Usuario.find({ name: regex });

    res.json({
      ok: true,
      voluntario,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "hable con el administrador",
    });
  }
};

// Método para modificar un voluntario y guardarlo en MongoDB
const actualizarVoluntario = async (req, res = response) => {
  const { id } = req.params;
  const { name, email } = req.body;

  console.log(req);
  console.log("entro a actualizarVoluntario");

  try {
    const voluntario = await Usuario.findById(id);

    const nombreExistente = await Usuario.findOne({ name: name });
    const emailExistente = await Usuario.findOne({ email: email });

    if (!voluntario) {
      return res.status(500).json({
        ok: false,
        msg: "Voluntario no encontrado",
      });
    }

    if (
      nombreExistente &&
      nombreExistente._id.toString() !== voluntario._id.toString()
    ) {
      return res.status(500).json({
        ok: false,
        msg: "Nombre de voluntario repetido, ingrese otro",
      });
    } else if (
      emailExistente &&
      emailExistente._id.toString() !== voluntario._id.toString()
    ) {
      return res.status(500).json({
        ok: false,
        msg: "Email ya registrado en la base de datos, ingrese otro",
      });
    }

    //Imagen
    /*let img
      if (req.file != undefined) {       
       
          await deleteImg(voluntario.img)
    
          img = await uploadImageOng(req)
      }*/

    const camposModificados = {
      name,
      email,
    };

    // Eliminar las propiedades con valor undefined del objeto
    Object.keys(camposModificados).forEach((key) =>
      camposModificados[key] === undefined ? delete camposModificados[key] : ""
    );

    // Actualizar los campos del voluntario y guardarlo en MongoDB
    await Usuario.findOneAndUpdate({ _id: id }, camposModificados);

    res.json({ message: "Voluntario modificado exitosamente" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al modificar el voluntario" });
  }
};

// dejo de Agregar

module.exports = {
  crearUsuario,
  getUsuarios,
  getUsuarioId,
  eliminarVoluntario,
  actualizarPassword,
  actualizarVoluntario,
  getVoluntarioPorNombre,
};
