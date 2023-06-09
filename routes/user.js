const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../schemas/userLoginSchema');

// Ruta para subir un file
router.post('/', async (req, res) => {
  try {
    var { username, password, userRol } = req.body;
    
    password = await criptPass(password);
    const newUser = new User({ username, password, userRol });
    await newUser.save();
    res.status(201).json("Usuario ha sido registrado exitosamente");
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
