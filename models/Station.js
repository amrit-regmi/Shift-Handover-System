const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const stationSchema = new mongoose.Schema({
  location: {
    type:String,
    required: true,
    unique: true,
    minlength:3
  },

  staffList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }],

  costumers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Costumer'
  }],

  shift:[
    {
      name: String,
      startTime: String
    }
  ]

})

stationSchema.plugin(uniqueValidator)
module.exports =  mongoose.model('Station',stationSchema)