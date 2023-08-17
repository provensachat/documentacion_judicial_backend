const express = require('express');
const router = express.Router();
const File = require('../schemas/fileSchema');
const NotesCaseSchema = require('../schemas/notesCaseSchema');

// Ruta para subir un file
router.post('/', async (req, res) => {
  try {
    const { nameFile, typeFile, linkFile, caseNumber } = req.body;
    
    // Obtener la fecha actual
    const dateUpload = Date.now();

    const newFile = new File({ nameFile, typeFile, linkFile, dateUpload, caseNumber });

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

// Ruta para obtener todos los File de un caseNumber
router.get('/', async (req, res) => {
  try {
    const { caseNumber } = req.query;

    // Busca al case en la base de datos
    const caseFiles = await File.find({ caseNumber });
    res.status(201).json(caseFiles);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

// Ruta para actualizar las notas asociadas a un documento
// Las notas son iguales si el nombre del caso, el nombre del usuario y nombre del documento son el mismo
// En caso contrario se considerará como registro único

router.patch('/update', async (req, res) => {
  try {
    const { caseNumber, caseNotesOWner, caseNotes, nameFile } = req.body.caseData;

    // Buscamos las notas asoaciadas al documento
    const NotesFile = await NotesCaseSchema.findOne({ caseNumber, caseNotesOWner, nameFile });
    
    // Si no existen, lo creamos
    if (NotesFile == null){
      const newNotesFile = new NotesCaseSchema({ caseNumber, caseNotesOWner, caseNotes, nameFile });
      await newNotesFile.save();
      res.status(201).json(newNotesFile);
    }
    else{
      const NotesFile = await NotesCaseSchema.findOne({ caseNumber, caseNotesOWner, nameFile });
      await NotesCaseSchema.deleteOne(NotesFile);
      const newNotesFile = new NotesCaseSchema({ caseNumber, caseNotesOWner, caseNotes, nameFile });
      await newNotesFile.save();

      res.status(201).json("Se han actualizado las notas del documento");
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

// Router para obtener las notas del documento

router.get('/notes', async (req, res) => {
  try {
    const { caseNumber, caseNotesOWner, nameFile } = req.query;

    // Buscamos las notas asoaciadas al documento
    const NotesFile = await NotesCaseSchema.findOne({ caseNumber, caseNotesOWner, nameFile });
    if (NotesFile != null){
      res.status(201).json(NotesFile);
    }
    else{
      res.status(201).json("No hay notas asociadas");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

// Router para obtener todas las notas escritas por un usuario en el documento

router.get('/notes/document', async (req, res) => {
  try {
    const { caseNumber, caseNotesOWner } = req.query;

    // Buscamos las notas asoaciadas al documento
    const NotesFile = await NotesCaseSchema.find({ caseNumber, caseNotesOWner});
    if (NotesFile != null){
      res.status(201).json(NotesFile);
    }
    else{
      res.status(201).json("No hay notas asociadas");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});

// Router para obtener los datos únicamente de un documento
// Lo obtendremos según el nombre del caso y el nombre del documento
router.get('/singleFile', async (req, res) => {
  try {
    const { caseNumber, nameFile } = req.query;

    // Busca al case en la base de datos
    const singleFile = await File.findOne({ caseNumber, nameFile });
    res.status(201).json(singleFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al obtener los archivos' });
  }
});


// Exporta el enrutador
module.exports = router;
