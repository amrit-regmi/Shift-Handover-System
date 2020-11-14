const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const staffSchema = new mongoose.Schema({
  name: {
    type:String,
    required: true,
    minlength: 5,
  },

  idCardCode: {
    type:String,
    unique:true,
    index:true,
    trim: true,
    sparse: true
  },

  currentStation:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Station'
  },

  email: {
    type: String,
    required: true,
    minlength: 9
  },

  phone:{
    type: String,
    minlength: 8
  },

  username: {
    type:String,
    unique: true,
    minlength: 5,
    index:true,
    trim: true,
    sparse: true
  },

  passwordHash: String,
  position:  {
    type:String,
    //enum: ['Station Supervisor','Base Maintenance Manager', 'Station Manger', 'Engineer','Mechanic', 'Administrator'] ,
  },

  contractType: {
    type:String,
    enum: ['Contractor','Employee']
  },

  contractHours:{
    type:Number

  },

  permission:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  },
  registerCode: String,
  resetCode: String,
  lastActive: String
  /* last active is based on handover not user login if the user is listed on handover then last active time is updted refernce to that handover*/
})

staffSchema.virtual('reqHours').get(function() {
  if(this.contractHours){
    return this.contractHours
  }

  if(this.contractType === 'Contractor') return 10
  return 8

})

staffSchema.set('toJSON', { virtuals:true })
staffSchema.set('toObject', { virtuals:true })
staffSchema.plugin(uniqueValidator)

module.exports =  mongoose.model('Staff', staffSchema)