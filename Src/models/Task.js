const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  taskCategory: {
    type:String,
    required:true
  },
  aircaft:{
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
    default: 'OPEN'
  },
  createdAt: {
    type:String,
    required:true
  },
  createdBy: String,
  updates:[{
    dateTime:String,
    by: String,
    update: String,
  }]

})

module.exports = mongoose.model('Task',taskSchema)