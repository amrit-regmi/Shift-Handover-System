const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const staffSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
    minlength: 5,
  },

  idCardCode: String,

  currentStation:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },

  email: {
    type: String,
    required: true,
    minlength: 9
  },

  username: {
    type:String,
    unique: true,
    minlength: 5,
    required: true
  },

  passwordHash: String,
  postion:  {
    type:String,
    enum: ['Station Supervisor','Base Maintenance Manager', 'Station Manger', 'Engineer','Mechanic', 'Administrator'] ,
  },

  type: {
    type:String,
    enum: ['Contractor','Employee']
  },

  registerCode: String,
  lastActive: String
  /* last active is based on handover not user login if the user is listed on handover then last active time is updted refernce to that handover*/
})

staffSchema.plugin(uniqueValidator)

module.exports =  mongoose.model('Staff', staffSchema)