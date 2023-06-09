const express = require('express');
const router = express.Router();
const File = require('../schemas/fileSchema');

// Ruta para subir un file
router.post('/', async (req, res) => {
  try {
    const { nameFile, typeFile, linkFile } = req.body;
    const newFile = new File({ nameFile, typeFile, linkFile });
    await newFile.save();
    res.status(201).json(newFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el archivo' });
  }
});

// Ruta para obtener todos los File
router.get('/all', async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

// Exporta el enrutador
module.exports = router;
