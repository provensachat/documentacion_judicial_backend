const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const observationSchema = new Schema({
  observationOwner: {
    type: String,
    required: true,
  },
  observationOwnerRol: {
    type: String,
    enum: ['gestorJudicial', 'abogado', 'fiscal', 'ciudadano', 'juez', 'auditor'],
    required: true
  },
  observationDate: {
    type: Date,
    required: true
  },
  observationDescription: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('Observation', observationSchema);
