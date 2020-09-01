const mongoose = require('mongoose')

const handoverSchema = new mongoose.Schema({
  station:{ type:mongoose.Schema.Types.ObjectId,
    ref:'Station',
    required:true
  },
  date: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  tasks:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Task'
  },
  staffAndTime:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'TimeSheet'
  }
})


module.exports = mongoose.model('Handover', handoverSchema)