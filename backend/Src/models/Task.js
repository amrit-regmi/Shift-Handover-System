const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  taskCategory: {
    type:String,
    required:true
  },

  aircraft:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Aircraft',
    required:  () => this.taskCategory === 'AIRCRAFT'
  },
  description: {
    type:String,
    required:true
  },
  status: {
    type:String,
    enum:['DEFERRED', 'CLOSED', 'OPEN'],
  },
  createdAt: {
    type:String,
    required:true
  },
  createdBy: String,
  updates:[{
    handoverId: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'ShiftReport'
    },
    action:{
      type:String,
      enum:['DEFERRED', 'CLOSED', 'OPEN' ,'NOTES_ADDED', 'TASK_CREATED_OPEN','TASK_CREATED_CLOSED', 'TASK_CREATED_DEFERRED'],
    },
    note:{
      type:String
    }


  }]

})

module.exports = mongoose.model('Task',taskSchema)