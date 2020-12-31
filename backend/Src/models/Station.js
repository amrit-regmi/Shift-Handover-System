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
  },

  mailingList:[{
    type:String,
  }]


})

stationSchema.plugin(uniqueValidator)

stationSchema.post(['deleteOne','findOneAndDelete','remove'], { document:false, query: true } , async function() {
  const id = this.getFilter()['_id']
  const Costumer = require('./Costumer')
  await Costumer.updateMany({ stations :  id },{ $pull: { stations:  id } })

  const ShiftReport = require('./ShiftReport')
  const sr = await ShiftReport.deleteMany({ station: id })
  console.log(`Deleted Station ${id} and ${sr.n} shift Reports` )
})

stationSchema.post('save',async function() {
  const Costumer = require('./Costumer')
  await Costumer.updateMany({ _id:{ $in: this.costumers } }, { $addToSet:{ stations: this._id } })
  console.log(`Created Station ${this.id} and updated relevent costumers`)
})

module.exports =  mongoose.model('Station',stationSchema)