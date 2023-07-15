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
            caseState,
            casePrivacy
          } = req.body;
          
    const caseData = {};
          
    if (caseEntity){
      caseData.caseEntity = caseEntity;
      
      var code = generarCodigo();

      while (await findCaseNumber(caseEntity + code) != null){
        code = generarCodigo();
      }
      
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

    if (casePrivacy){
      caseData.casePrivacy = casePrivacy;
    }else{
      caseData.casePrivacy = ["Publico"]
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

// Obtener todos los casos asociados a un usuario según el rol que tenga

router.get('/user', async (req, res) => {
  try {
    const { userRol, username } = req.query;
    var cases = [];
    if (userRol == 'abogado') {
      cases = await Case.find({ caseLawyer: { $in: [username] } });
    }
    if (userRol == 'fiscal') {
      cases = await Case.find({ caseFiscal: { $in: [username] } });
    }
    if (userRol == 'juez') {
      cases = await Case.find({ caseJudge: { $in: [username] } });
    }
    // Devuelve los casos asociados como respuesta en formato JSON
    res.json(cases);
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

// Esto es la actualización

router.patch('/update/state', async (req, res) => {
  try{
    const { caseNumber, caseState } = req.body.caseData;
    const caseData = await Case.findOne({"caseNumber":caseNumber});
    caseData.caseState = caseState;
    await caseData.save();
    res.status(201).json("El estado del caso ha sido actualizado");
  }
  catch (error){
    console.log(error);
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

// This is gonna find if the caseNumber is already on the table
// If is not, its NULL, is a unique caseNumber
// If it is, its NOT NULL, is a repeated caseNumber

async function findCaseNumber (caseNumber){
  const searchResult = await Case.findOne({"caseNumber":caseNumber});
  return searchResult;
}

// Exporta el enrutador
module.exports = router;
