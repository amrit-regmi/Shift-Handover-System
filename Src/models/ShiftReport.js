const mongoose = require('mongoose')

const shiftReportSchema = new mongoose.Schema({
  station:{ type:mongoose.Schema.Types.ObjectId,
    ref:'Station',
    required:true
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
  },
  tasks:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Task'
  }],
  staffAndTime:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'TimeSheet'
  }],
  flag: {
    type: String,
    enum: ['MOST_RECENTLY_COMPLETED', 'ON_PROGRESS', 'COMPLETE'],
    default: 'ON_PROGRESS'
  },
  submittedAt: String,
  stationKey: String,
})


module.exports = mongoose.model('ShiftReport', shiftReportSchema)