const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const extensionsSchema = new Schema({
  logoUbicationExtension: {
    type: String,
    required: false
  },
  titleExtension: {
    type: String,
    required: true
  },
  descriptionExtension: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Extensions', extensionsSchema);