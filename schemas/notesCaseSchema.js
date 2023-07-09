const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesCaseSchema = new Schema({
  caseNumber: {
    type: String,
    required: true,
  },
  nameFile: {
    type: String,
    required: true
  },
  caseNotes: {
    type: String,
    required: false
  },
  caseNotesOWner: {
    type: String,
    required: false
  }
});

module.exports = mongoose.model('NotesCaseSchema', notesCaseSchema);
