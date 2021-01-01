const { isArray } = require('lodash')
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


shiftReportSchema.post(['save','findOne', 'find'] ,{ query:true,document:true } ,async function(docs){
  const populateFn = async (doc) => {
    try {
      await doc.populate(
        [
          {
            path:'station',
            select: ['id','location']
          },
          {
            path:'staffAndTime',
            select:['id','endTime','startTime', 'staffAndTime'],
            populate:{
              path:'staff',
              select: ['name']
            },

          },
          {
            path:'tasks' ,
            select:['id','aircraft','taskCategory', 'description', 'status', 'updates'],
            populate:{
              path:'aircraft updates',
              select:['registration','id','costumer','action','handoverId','note'],
              populate:{
                path: 'costumer handoverId',
                select:['name','id','shift' ,'station' ,'startTime'],
                populate:{
                  path: 'station',
                  select:['id', 'location'],
                }
              }
            },
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