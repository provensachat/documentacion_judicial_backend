const express = require('express');
const router = express.Router();
const Extensions = require('../schemas/extensionsSchema');
const ExtensionsActive = require('../schemas/extensionsActiveSchema');

// Ruta para guardar una extensión
router.post('/', async (req, res) => {
  try {
    const { logoUbicationExtension, titleExtension, descriptionExtension} = req.body;    

    const newExtension = new Extensions({ logoUbicationExtension, titleExtension, descriptionExtension});

    await newExtension.save();
    res.status(201).json(newExtension);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la extensión' });
  }
});

// Ruta para guardar una extensión activa
router.post('/active', async (req, res) => {
  try {
    const { titleExtension, userExtension} = req.body;

    const extensionRegistered = await ExtensionsActive.findOne({ titleExtension, userExtension});

    if (extensionRegistered !== null){
      const datePaid = new Date();
  
      // Agrega un mes a la fecha actual
      const finalDatePaid = new Date(datePaid.getFullYear(), datePaid.getMonth() + 1, datePaid.getDate());
      
      extensionRegistered.datePaid = datePaid;
      extensionRegistered.finalDatePaid = finalDatePaid;
  
      await extensionRegistered.save();
      res.status(201).json("Se ha actualizado la extensión caso");
    }
    else{
      const datePaid = new Date();
  
      // Agrega un mes a la fecha actual
      const finalDatePaid = new Date(datePaid.getFullYear(), datePaid.getMonth() + 1, datePaid.getDate());

      const newExtensionActive = new ExtensionsActive({ titleExtension, userExtension, datePaid, finalDatePaid});
  
      await newExtensionActive.save();
      res.status(201).json("Se ha creado la nueva extensión activa");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la extensión' });
  }
});

// Ruta para obtener todas las extensiones
router.get('/', async (req, res) => {
  try {
    // Busca al case en la base de datos
    const extensionsList = await Extensions.find();
    res.status(201).json(extensionsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las extensiones' });
  }
});

// Ruta para obtener la extensión activa que necesitamos según username y nombre Extensión
router.get('/active', async (req, res) => {
  try {
    const { titleExtension, userExtension } = req.query;
    // Busca al case en la base de datos  
    const extensionActive = await ExtensionsActive.findOne({ titleExtension, userExtension});
    res.status(201).json(extensionActive);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las extensiones' });
  }
});

// Ruta para obtener todas las extensiones activas de un usuario
router.get('/active/user', async (req, res) => {
  try {
    const { userExtension } = req.query;

    // Busca la extensión activa en la base de datos  
    
    const extensionActive = await ExtensionsActive.find({ userExtension});
    res.status(201).json(extensionActive);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener las extensiones' });
  }
});

// Exporta el enrutador
module.exports = router;