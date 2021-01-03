const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const aircraftSchema = new mongoose.Schema({
  registration : {
    type:String,
    unique:true
  },
  costumer: {
    type: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Costumer'
      },
      name: String
    },
    required:true
  },
  tasks:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'Task'
  }]
})
aircraftSchema.plugin(uniqueValidator)

/**After the Aircraft is Deleted */
aircraftSchema.post(['deleteOne','findOneAndDelete'], async function() {
  const id = this.getFilter()['_id']
  const Costumer = require('./Costumer')
  await Costumer.findOneAndUpdate({ aircrafts: id }, { $pull:{ aircrafts:id } })
})
module.exports = mongoose.model('Aircraft',aircraftSchema)