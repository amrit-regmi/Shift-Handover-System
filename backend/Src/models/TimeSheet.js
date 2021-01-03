const mongoose = require('mongoose')
const timeSheetSchema = new mongoose.Schema({
  staff:{
    required:true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },

  date: {
    required:true,
    type: Date,
  },

  startTime: String,
  endTime: String,
  break: {
    type: Number,
    defaut: 30
  },
  shiftReport: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'ShiftReport'
  },
  status: {
    type: String,
    enum: [
      'APPROVED',
      'AMENDED',
      'CLARIFICATION_REQUSTED',
      'PENDING_APPROVAL'],
    default: 'PENDING_APPROVAL'
  },
  remarks: {
    type: Array,
    default:[]
  },
  station : {
    id:{ type: mongoose.Schema.Types.ObjectId,
      ref:'Station' },
    location: String

  },
  shift:{
    type: String,

  }
})

module.exports =  mongoose.model('TimeSheet',timeSheetSchema)