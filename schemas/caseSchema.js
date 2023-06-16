const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
  caseNumber: {
    type: String,
    required: true,
    unique: true
  },
  caseTitle: {
    type: String,
    required: true
  },
  caseLawyer: {
    type: [String],
    default: [],
    required: false
  },
  caseFiscal: {
    type: [String],
    default: [],
    required: false
  },
  caseJudge: {
    type: [String],
    default: [],
    required: false
  },
  caseJudicialGestor: {
    type: [String],
    default: [],
    required: true
  },
  caseDemandante: {
    type: [String],
    default: [],
    required: false
  },
  caseDemandado: {
    type: [String],
    default: [],
    required: false
  },
  caseDescription: {
    type: String,
    required: false
  },
  caseEntity: {
    type: String,
    required: true
  },
  caseState: {
    type: String,
    enum: ['Por Asignar', 'En ejecucion', 'Finalizado', 'En revision'],
    required: true
  }

});

module.exports = mongoose.model('Case', caseSchema);
