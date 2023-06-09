const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../schemas/userLoginSchema');
const UserData = require('../schemas/userDataSchema');

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

// Ruta para obtener los datos de un usuario
router.get('/', async (req, res) => {
  try {
    const { username } = req.query;

    console.log(username);
    console.log("///");

    // Busca al usuario en la base de datos
    const userData = await UserData.findOne({ username });

    console.log(userData);

    res.status(201).json(userData);
  } catch (error) {
    if (error.code == 11000){
      res.status(500).json('El usuario no existe');
    }
  }
});

// Ruta para actualizar los datos de un usuario
router.patch('/setting', async (req, res) => {
  try {
    var { username} = req.body;

    // Busca al usuario en la base de datos
    const userData = await UserData.findOne({ username });

    if (req.body.email) {
      userData.email = req.body.email;
    }

    if (req.body.cellphone) {
      userData.cellphone = req.body.cellphone;
    }

    if (req.body.entity) {
      userData.entity = req.body.entity;
    }

    await userData.save();
    res.status(201).json("El usuario ha sido actualizado");
  } catch (error) {
    if (error.code == 11000){
      res.status(500).json('El nombre de usuario ya existe');
    }
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
