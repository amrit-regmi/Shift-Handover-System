const mongoose = require('mongoose')
const timeSheetSchema = new mongoose.Schema({
  staff:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  date: String,
  startTime: String,
  endTime: String,
  station:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Station'
  },
  handover: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Handover'
  },
  status: {
    type: String,
    enum: ['Approved', 'Amended','Clarification Requested', 'Pending Approval'],
    default: 'Pending Approval'
  },
  remarks: {
    type: Array,
    default:[]
  }
})

module.exports =  mongoose.model('TimeSheet',timeSheetSchema)