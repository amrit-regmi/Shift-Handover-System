const mongoose = require('mongoose')

const costumerSchema = mongoose.Schema({
  name:String,
  aircrafts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aircraft'
    }
  ],
  staffList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff'
    }
  ],
  stations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station'
    }
  ]

})
module.exports = mongoose.model('Costumer',costumerSchema)