const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const stationSchema = new mongoose.Schema({
  location:{
    type:String,
    unique: true,
    minlength:3
  },
  address:{
    country:{
      type:String,
      required: true,
    },
    city:{
      type:String,
      required: true },
    postcode:{
      type:String,
      required: true },
    street:{
      type:String,
      required: true }
  },

  phone:[
    { type:String,
      /*required:true */ }
  ],

  email: {
    type:String,
    /*required:true */
  },

  procedures:[{
    title:String,
    description: String
  }],

  costumers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Costumer'
  }],

  shifts:[
    {
      name:  {
        type:String,
        required: true,
      },
      startTime: {
        type:String,
        required: true,
      }
    }
  ]
  ,
  stationKey: {
    type:String,
    required:true
  }

})

stationSchema.plugin(uniqueValidator)
module.exports =  mongoose.model('Station',stationSchema)