const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const juridicPersonSchema = new Schema({
  nameJuridicPerson: {
    type: String,
    required: true
  },
  identificationJuridicPerson: {
    type: String,
    required: true
  },
  cellphoneJuridicPerson: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('JuridicPerson', juridicPersonSchema);
