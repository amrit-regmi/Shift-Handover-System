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

  lastActive:{
    station:{
      id:{ type: mongoose.Schema.Types.ObjectId,
        ref: 'Station' },
      location:String
    },
    activeAt: Date
  },
  /* last active is based on handover not user login if the user is listed on handover then last active time is updted refernce to that handover*/

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

  disabled: {
    type:Boolean,
    default: false
  }

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

/**After Staff is removed ,Remove related Permissions and TImesheet Records as well */
staffSchema.post(['deleteOne','findOneAndDelete','remove'], { document:false, query: true },async function() {
  const id = this.getFilter()['_id']
  console.log(`Removed staff ${id} ` )

  const Permission = require('./Permission')
  await Permission.findOneAndDelete({ staffId: id })
  console.log(`Removed Permission document for staff ${id} ` )

  const TimeSheet = require('./TimeSheet')
  const t = await TimeSheet.deleteMany({ staff:id })
  console.log(`Removed ${t.n} Timesheet record assosciated with staff ${id} ` )
})

module.exports =  mongoose.model('Staff', staffSchema)