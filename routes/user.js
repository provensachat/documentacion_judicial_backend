const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../schemas/userLoginSchema');
const UserData = require('../schemas/userDataSchema');
const JuridicPerson = require('../schemas/juridicPersonSchema');

// Ruta para subir un file
router.post('/', async (req, res) => {
  try {
    var { username, password, userRol } = req.body;
    
    password = await criptPass(password);
    const newUser = new User({ username, password, userRol });
    await newUser.save();

    const newUserData = new UserData({ username });
    await newUserData.save();

    res.status(201).json("Usuario ha sido registrado exitosamente");
  } catch (error) {
    if (error.code == 11000){
      res.status(500).json('El nombre de usuario ya existe');
    }
  }
});

// Ruta para crear una persona juridica
router.post('/person', async (req, res) => {
  try {
    var { nameJuridicPerson, 
          identificationJuridicPerson, 
          cellphoneJuridicPerson } = req.body;
    
    const newJuridicPerson = new JuridicPerson({ nameJuridicPerson, identificationJuridicPerson, cellphoneJuridicPerson });
    await newJuridicPerson.save();

    res.status(201).json("Persona Juridica ha sido registrada exitosamente");
  } catch (error) {
    if (error.code == 11000){
      res.status(500).json('El nombre de usuario ya existe');
    }
  }
});

// Ruta para obtener los datos de un usuario
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;

    // Busca al usuario en la base de datos
    const userData = await UserData.findOne({ username });

    res.status(201).json(userData);
  } catch (error) {
    if (error.code == 11000){
      res.status(500).json('El usuario no existe');
    }
  }
});

// Obtener todos los usuarios según un rol
router.get('/person/all', async (req, res) => {
  try {
    // Busca a los ciudadanos juridicos
    const juridicPersons = await JuridicPerson.find();

    // Devuelve los usuarios como respuesta en formato JSON
    res.json(juridicPersons);
  } catch (error) {
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Obtener todos los ciudadanos juridicos
router.get('/all', async (req, res) => {
  try {
    const { userRol } = req.query;

    // Busca a los usuarios en la base de datos por rol
    const users = await User.find({ userRol });

    // Devuelve los usuarios como respuesta en formato JSON
    res.json(users);
  } catch (error) {
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Obtener todos los usuarios con rol
router.get('/list', async (req, res) => {
  try {
    // Busca a todos los usuarios
    const user = await User.find();
    // Devuelve los usuarios como respuesta en formato JSON
    res.json(user);
  } catch (error) {
    console.log(error);
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Obtener la información completa de los datos de cada usuario
router.get('/list/userdata', async (req, res) => {
  try {
    // Busca a todos los usuarios
    const userData = await UserData.find();
    // Devuelve los usuarios como respuesta en formato JSON
    res.json(userData);
  } catch (error) {
    console.log(error);
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});


// Ruta para actualizar los datos de un usuario
router.patch('/setting', async (req, res) => {
  try {
    const parameter = req.body.parameter;
    const username = parameter.username;

    // Busca al usuario en la base de datos
    const userData = await UserData.findOne({ username });

    if (parameter.email){
      userData.email = parameter.email;
    }

    if (parameter.cellphone){
      userData.cellphone = parameter.cellphone;
    }

    if (parameter.entity){
      userData.entity = parameter.entity;
    }

    await userData.save();
    res.status(201).json("El usuario ha sido actualizado");
  } catch (error) {
    if (error.code == 11000){
      res.status(500).json('El nombre de usuario ya existe');
    }
  }
});

router.patch('/rol', async (req, res) => {
  try{
    const username = req.body.caseData.username;
    const user = await User.findOne({ username });
    user.userRol = req.body.caseData.userRol;
    await user.save();
    res.status(201).json('Actualización de rol exitosa!');
  }
  catch (error) {
    console.log(error)
    res.status(500).json('Ocurrio un error en la actualización');
  }
});

async function criptPass(userPass) {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(userPass, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}


// Exporta el enrutador
module.exports = router;
