var mongoose = require('mongoose');

var personSchema = new mongoose.Schema({
  name: String,
  height: {type: Number, default: 0},
  married: {type: Boolean, default: false}
});

module.exports = mongoose.model('Person', personSchema);
