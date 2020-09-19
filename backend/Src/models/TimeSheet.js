const mongoose = require('mongoose')
const timeSheetSchema = new mongoose.Schema({
  staff:{
    required:true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  startTime: String,
  endTime: String,
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
  }
})

module.exports =  mongoose.model('TimeSheet',timeSheetSchema)