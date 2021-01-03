const { isArray } = require('lodash')
const mongoose = require('mongoose')

const shiftReportSchema = new mongoose.Schema({
  station:{
    type:{
      _id:false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Station'
      },
      location: String
    },
    required:true
  },
  shift: {
    type: String,
    required: true
  },

  date: {
    type:Date,
    required:true

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

  staffAndTime:[
    { _id:false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Timesheet'
      },
      staff: {
        id:String,
        name:String
      },
      startTime: String,
      endTime: String,
    }
  ],
  flag: {
    type: String,
    enum: ['MOST_RECENTLY_COMPLETED', 'ON_PROGRESS', 'COMPLETE'],
    default: 'ON_PROGRESS'
  },
  submittedAt: String,
  stationKey: String,
})


shiftReportSchema.post(['save','findOne', 'find'] ,{ query:true,document:true } ,async function(docs){
  const populateFn = async (doc) => {
    try {
      await doc.populate(
        [
          {
            path:'tasks' ,
            select:['id','aircraft','taskCategory', 'description', 'status', 'updates'],
          }
        ]
      ).execPopulate()
    } catch(e){
      /**Throw Error except for null document */
      if(e.message !== 'Cannot read property \'populate\' of null'){
        throw new Error(e.message)
      }
    }
  }

  if(isArray(docs)){
    for (let doc of docs) {
      await populateFn(doc)
    }
  }else{
    await populateFn(docs)
  }

})

module.exports = mongoose.model('ShiftReport', shiftReportSchema)