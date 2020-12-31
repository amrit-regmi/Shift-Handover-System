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

costumerSchema.post(['deleteOne','findOneAndDelete'], async function() {
  const id = this.getFilter()['_id']
  console.log(`Removed Costumer ${id}`)

  const Station = require('./Station')
  const s = await Station.updateMany({ costumers: id },{ $pull:{ costumers: id } })

  console.log(`Removed Costumer ${id} from ${s.nModified} stations ` )

  const Aircraft = require('./Aircraft')
  const a = await Aircraft.deleteMany({ costumer: id })
  console.log(`Removed ${a.n} Aircrafts owned by Costumer ${id} ` )
})

costumerSchema.post('save', async function() {
  console.log(`Costumer ${this._id} Created` )

  const Station = require('./Station')
  const s = await Station.updateMany( { _id:{ $in: this.stations } } ,{ $push:{ costumers: this._id } })
  console.log(`${s.nModified} Stations updated to Include Costumer ${this._id}` )

})

module.exports= mongoose.model('Costumer',costumerSchema)