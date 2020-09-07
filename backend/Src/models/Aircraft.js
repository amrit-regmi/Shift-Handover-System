const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const aircraftSchema = new mongoose.Schema({
  registration : {
    type:String,
    unique:true
  },
  costumer: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Costumer'
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Task'
  }]
})
aircraftSchema.plugin(uniqueValidator)
module.exports = mongoose.model('Aircraft',aircraftSchema)