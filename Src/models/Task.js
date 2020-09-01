const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  taskType: {
    type:String,
    required:true
  },
  aircaft:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Aircraft',
    required:  () => this.taskType === 'Aircraft'
  },
  description: {
    type:String,
    required:true
  },
  status: {
    type:String,
    enum:['Deffered', 'Closed', 'Open'],
    default: 'Open'
  },
  createdDate: {
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