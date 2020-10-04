const ShiftReport =  require('../models/ShiftReport')
const TimeSheet = require('../models/TimeSheet')
const Task = require('../models/Task')
const { UserInputError,AuthenticationError } = require('apollo-server')
const _ = require('lodash')
const config = require('../../config')
const jwt  = require('jsonwebtoken')


const shiftReportResolver = {
  Mutation: {
    submitShiftReport: async(root,args,context) => {
      const currentStation = context.currentStation
      if (!currentStation) {
        throw new AuthenticationError('Invalid authentication')
      }

      //console.log(currentStation)
      try{
        let shiftReport
        shiftReport = await ShiftReport.findById(args.id)
        if(!shiftReport){
          shiftReport = new  ShiftReport({
            station:args.station,
            shift: args.shift,
            startTime:args.startTime,
            endTime: args.endTime,
          })
        }
        const staffAndTime = args.staffs.map( staff => {
          const user =  staff.name
          /**Verify the jwt token  return the decoded information */
          try{
            //console.log(staff)
            const data = jwt.verify(staff.signOffKey, config.JWT_SECRET)
            return { staff: data.id, startTime: data.startTime, endTime:data.endTime }
          } catch (err){
            console.log('TimeSheet Verification error')
            throw new AuthenticationError(`${user} cannot be authenticated, please signoff again : ${err}`)
          }
        })


        const timeSheetResult = await TimeSheet.insertMany(staffAndTime)

        shiftReport.staffAndTime = timeSheetResult

        shiftReport.tasks = []
        if (args.tasks.length > 0){

          const tasks = await Promise.all(args.tasks.map(async task => {


            /**If task has id field means task already exists on db */
            if(task.id){
              const existingTask = await Task.findById(task.id).exec()

              /** If task is from the current handover - task will have one update with current handoverId and taskcreated action*/
              if(existingTask.updates && existingTask.updates.length === 1 && existingTask.updates[0].handoverId=== shiftReport.id && existingTask.updates[0]==='TASK_CREATED'  ){
                existingTask.description = task.description
                existingTask.status = task.action
              }
              /**If task is deferred task action is required */
              if(existingTask.status === 'DEFERRED'){

                if(!task.action) throw new UserInputError ('Action is requested on this task')
              }
              /**Action wil be set as a new Status and will be added to update field */
              if(task.action) {
                if(task.action !== 'NOTES_ADDED'){
                  existingTask.status = task.action
                }
                if(!shiftReport.task) {
                  shiftReport.task = [task.Id]
                }else{
                  shiftReport.task = [...shiftReport.task, (task.id)]
                }

                const newUpdate = { action: existingTask.status, handoverId: shiftReport.id, notes : task.newNotes }
                if(!existingTask.updates) {
                  existingTask.updates = [newUpdate]
                }else{

                  existingTask.updates = [...existingTask.updates,newUpdate]
                }


              }
              try{
                //console.log(existingTask)
                await existingTask.save()
              } catch(error) {
                console.log('Task Error', task.id)
                throw new UserInputError(error,'Please check tasks inputs')
              }
              return null

            }
            /**If task doesnot have id field means it is new task*/
            if(!task.id){

              task.createdAt = args.endTime
              /*Setting action to Status*/
              if(task.action) {
                task.status = task.action
              }

              task.updates = [{ handoverId: shiftReport.id, action: 'TASK_CREATED' , notes: task.action }]
              /**Remove action field */
              delete task.action
              return task
            }

          }))
          //console.log(tasks)
          const insertedTask  =   await Task.insertMany( _.filter(tasks,task => task!== null))
          const taskIds = insertedTask.map(task => task._id)
          shiftReport.tasks = [...shiftReport.tasks,...taskIds]
          await shiftReport.save()
        }

        /**
         * Setting last shift report from the station as complete
         */
        await ShiftReport.findOneAndUpdate({ flag:'MOST_RECENTLY_COMPLETED', station:args.station },{ flag: 'COMPLETE' })

        /**
         * Setting the current report as Most recent report
         */
        shiftReport.flag = 'MOST_RECENTLY_COMPLETED'
        await shiftReport.save()

        return await ShiftReport.populate( shiftReport,
          [
            {
              path:'station'
            },
            {
              path:'staffAndTime',
              populate:{
                path:'staff'
              }
            },
            {
              path:'tasks' ,
              populate:{
                path:'aircraft updates',
                populate:{
                  path: 'costumer handoverId'
                }
              },

            }
          ])

      }catch(err){
        console.log(err)
        throw new UserInputError(err.message)
      }
    },


    startReporting : async ( root,args ) => {
      const shiftReport = new ShiftReport({
        station:args.station,
        shift: args.shift,
        startTime:args.startTime,
      })
      //await shiftReport.save()
      const lastShiftsTasks = await ShiftReport.findOne({ station:args.station, flag:'MOST_RECENTLY_COMPLETED' }).populate([{ path:'tasks' , populate:{ path:'aircraft',populate:{ path: 'costumer' } } }]).select('tasks')
      shiftReport.tasks = lastShiftsTasks.tasks.filter(task => task.status === 'CLOSED' || task.status === 'DEFERRED')
      return shiftReport
    }
  },

  Query:{

    getShiftReport: async(root,args,context) => {
      const currentStation = context.currentStation
      if (!currentStation) {
        throw new AuthenticationError('Invalid authentication')
      }
      if (!args.station && !args.flag){
        throw new UserInputError('Missing arguments')
      }
      const shiftReport = await ShiftReport.findOne({ ...args }).populate(
        [
          {
            path:'station'
          },
          {
            path:'staffAndTime',
            populate:{
              path:'staff'
            }
          },
          {
            path:'tasks' ,
            populate:{
              path:'aircraft updates',
              populate:{
                path: 'costumer handoverId'
              }
            },

          }
        ])
      return shiftReport
    }
  }

}

module.exports = shiftReportResolver