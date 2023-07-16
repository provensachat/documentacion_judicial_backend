const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const auditorSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  auditorEntity: {
    type: String,
    required: true
  },
  auditorDescription: {
    type: String,
    required: true
  },
  dateInscription: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Auditor', auditorSchema);
