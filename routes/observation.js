const express = require('express');
const router = express.Router();
const Observation = require('../schemas/observationSchema');

// Ruta para subir un file
router.post('/', async (req, res) => {
  try {
    const { observationOwner, observationOwnerRol, observationDescription } = req.body;
    
    // Obtener la fecha actual
    const observationDate = Date.now();

    const newObservation = new Observation({ observationOwner, observationOwnerRol, observationDate, observationDescription });

    await newObservation.save();
    res.status(201).json("Se ha enviado la observación");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear la observación' });
  }
});

// Exporta el enrutador
module.exports = router;