const express = require('express');
const router = express.Router();
const Case = require('../schemas/caseSchema');

// Ruta para crear un caso
router.post('/', async (req, res) => {
  try {
    const { caseTitle, 
            caseLawyer,
            caseFiscal,
            caseJudge,
            caseJudicialGestor,
            caseDemandante,
            caseDemandado,
            caseDescription,
            caseEntity,
            caseState
          } = req.body;
          
    const caseData = {};
          
    if (caseEntity){
      caseData.caseEntity = caseEntity;
      const code = generarCodigo();
      caseData.caseNumber = caseEntity + code;
    }

    if (caseState){
      caseData.caseState = caseState;
    }

    if (caseTitle){
      caseData.caseTitle = caseTitle;
    }

    if (caseLawyer){
      caseData.caseLawyer = usernameReturn(caseLawyer, "username");
    }else{
      caseData.caseLawyer = ["No asignado"]
    }

    if (caseFiscal){
      caseData.caseFiscal = usernameReturn(caseFiscal, "username");
    }else{
      caseData.caseLawyer = ["No asignado"]
    }

    if (caseJudge){
      caseData.caseJudge = usernameReturn(caseJudge, "username");
    }else{
      caseData.caseLawyer = ["No asignado"]
    }

    if (caseJudicialGestor){
      caseData.caseJudicialGestor = caseJudicialGestor;
    }

    if (caseDemandante){
      caseData.caseDemandante = usernameReturn(caseDemandante, "nameJuridicPerson");
    }else{
      caseData.caseLawyer = ["No asignado"]
    }

    if (caseDemandado){
      caseData.caseDemandado = usernameReturn(caseDemandado, "nameJuridicPerson");
    }else{
      caseData.caseLawyer = ["No asignado"]
    }

    if (caseDescription){
      caseData.caseDescription = caseDescription;
    }

    const newCase = new Case(caseData);
    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error al crear el archivo' });
  }
});

// Obtener todos los registros de la tabla "Casos"

router.get('/all', async (req, res) => {
  try {
    // Busca a todos los casos
    const cases = await Case.find();

    // Devuelve los usuarios como respuesta en formato JSON
    res.json(cases);
  } catch (error) {
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Obtener el registro de un sólo caso

router.get('/', async (req, res) => {
  try {
    const { caseNumber } = req.query;

    // Busca al caso en la base de datos
    const caseData = await Case.findOne({ caseNumber });

    // Devuelve los usuarios como respuesta en formato JSON
    res.json(caseData);
  } catch (error) {
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// This its gonna updated any case

router.patch('/update', async (req, res) => {
  try {

    const { caseNumber,
      caseJudge,
      caseLawyer,
      caseFiscal,
      caseDemandante,
      caseDemandado,
      caseDescription,
      caseEntity,
      caseState,
      caseTitle
    } = req.body.caseData;

    const caseData = await Case.findOne({"caseNumber":caseNumber});

    if (caseTitle) {
      caseData.caseTitle = caseTitle;
    }

    if (caseEntity) {
      caseData.caseEntity = caseEntity;
    }

    if (caseState) {
      caseData.caseState = caseState;
    }

    if (caseJudge) {
      caseData.caseJudge = caseJudge;
    }

    if (caseLawyer) {
      caseData.caseLawyer = caseLawyer;
    }

    if (caseFiscal) {
      caseData.caseFiscal = caseFiscal;
    }

    if (caseDemandante) {
      caseData.caseDemandante = caseDemandante;
    }

    if (caseDemandado) {
      caseData.caseDemandado = caseDemandado;
    }

    if (caseDescription) {
      caseData.caseDescription = caseDescription;
    }

    if (caseDemandado) {
      caseData.caseDemandado = caseDemandado;
    }    
    
    await caseData.save();
    res.status(201).json("El caso ha sido actualizado");

  } catch (error) {
    // Manejo de errores si ocurre alguna excepción
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// Random alphanumber of 6 digits

function generarCodigo() {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let codigo = '';
  for (let i = 0; i < 5; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

// This one is gonna return the username inside the object
// Was created an if for difference between the two possibilities

function usernameReturn(arrayIncoming, attribute){
  var arrayNames = [];
  
  for (let i = 0; i < arrayIncoming.length; i++) {
    if (attribute == 'username'){
      arrayNames.push(arrayIncoming[i].username);
    }
    if (attribute == 'nameJuridicPerson'){
      arrayNames.push(arrayIncoming[i].nameJuridicPerson);
    }
  }

  return arrayNames;
}

// Exporta el enrutador
module.exports = router;
