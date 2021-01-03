const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  taskCategory: {
    type:String,
    required:true
  },

  aircraft:{
    type: {
      id:String,
      registration: String,
      costumer:{
        id:String,
        name:String
      },
    },
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
      type:String,
      required:true
    },
    handoverDetail: {
      type:String,
      required:true
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

taskSchema.pre('save', async function() {
  const Aircraft = require ('./Aircraft')
  const aircraft = await Aircraft.findOne({ _id:this.aircraft.id })
  this.aircraft = {
    id:aircraft.id,
    registration: aircraft.registration,
    costumer: {
      id: aircraft.costumer.id,
      name: aircraft.costumer.name
    } }

})


taskSchema.post(['deleteOne','findOneAndDelete','remove'], { document:false, query: true },async function() {
  const id = this.getFilter()['_id']
  const ShiftReport = require('./ShiftReport')
  await ShiftReport.updateMany({ tasks: id }, { $pull: { tasks:id } })
})

module.exports = mongoose.model('Task',taskSchema)