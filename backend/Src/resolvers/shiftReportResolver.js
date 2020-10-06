const ShiftReport =  require('../models/ShiftReport')
const TimeSheet = require('../models/TimeSheet')
const Task = require('../models/Task')
const { UserInputError,AuthenticationError } = require('apollo-server')
const _ = require('lodash')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const { Model } = require('mongoose')


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
        /**If submitting the save shift report then report will have Id */
        shiftReport = await ShiftReport.findById(args.id)

        /**If shift report doesnot already have the required fileds and the required fields are not provided  while submit throws error */
        if(shiftReport ) {
          if(args.startTime){
            shiftReport.startTime = args.startTime
          }
          if(args.endTime){
            shiftReport.startTime = args.endTime
          }
          if (!(shiftReport.startTime && shiftReport.endTime && shiftReport.staffs.length) ){
            throw new UserInputError('Required arguments missing')
          }

        }

        /**If new shift report */
        if(!shiftReport){
          /**If shift report doesnot have all the required fields */
          if(!(args.startTime && args.endtime || args.staffs.length)){
            throw new UserInputError('Required arguments missing')
          }

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
              console.log(task)
              const existingTask = await Task.findById(task.id).exec()

              /** If task is from the current handover - task will have one update with current handoverId and taskcreated action*/
              if(existingTask.updates && existingTask.updates.length === 1 && existingTask.updates[0].handoverId=== shiftReport.id && existingTask.updates[0].action==='TASK_CREATED'  ){
                if(task.description ) existingTask.description = task.description
                if(task.action )existingTask.status = task.action
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
                /**Adding task to shift report */
                if(!shiftReport.tasks) {
                  shiftReport.tasks = [task.Id]
                }else{
                  shiftReport.tasks = [...shiftReport.tasks, (task.id)]
                }

                const newUpdate = { action: task.action, handoverId: shiftReport.id, note : task.newNotes }

                /**Add updates to task */
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
              return existingTask

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
          const insertedTask  =   await Task.insertMany( _.filter(tasks,task => !task.id))
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

      if (!(args.station && args.flag) && (!args.id || args.id === null) ){
        throw new UserInputError('Missing arguments')
      }


      if (!args.id && (!currentStation || currentStation.id !== args.station )) {

        throw new AuthenticationError('Invalid authentication')
      }

      let shiftReport

      try {
        if ( args.id) {
          //throw new Error('Testing')
          shiftReport = await ShiftReport.findById(args.id)
        } else{
          shiftReport = await ShiftReport.findOne({ ...args })
        }

        shiftReport = await  ShiftReport.populate( shiftReport,
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
      catch(err) {
        throw new Error(err)
        //console.log(err)
      }
    },

    getReportList : async (root,args,context) => {
      const currentStation = context.currentStation
      if (!args.stationId){
        /**TODO: Permission check needs to be implemented */
        const allReports = await ShiftReport.find({}).populate('station')
        return allReports
      }

      if (!currentStation || currentStation.id !== args.stationId ) {
        throw new AuthenticationError('Invalid authentication')
      }

      const shiftReports = await ShiftReport.find({ station:args.stationId }).populate('station')
      return shiftReports

    }
  }

}

module.exports = shiftReportResolver