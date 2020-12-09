const mongoose = require('mongoose')

const costumerSchema = mongoose.Schema({
  name:String,
  aircrafts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aircraft'
    }
  ],
  contract:{
    type: String
  },

  keyContacts:[
    {
      phone: String,
      description: String,
      email:String
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