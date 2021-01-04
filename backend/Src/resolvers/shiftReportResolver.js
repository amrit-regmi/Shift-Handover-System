const ShiftReport =  require('../models/ShiftReport')
const TimeSheet = require('../models/TimeSheet')
const Task = require('../models/Task')
const { UserInputError,AuthenticationError } = require('apollo-server')
const { getDatefromWeek ,getLastDateFromMonth } = require('../utils/helper')
const _ = require('lodash')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const { sendUShiftReportEmail } = require('../mailer/shiftReportEmail')
const Staff = require('../models/Staff')
const { Error } = require('mongoose')
const Aircraft = require('../models/Aircraft')

const shiftReportResolver = {
  Mutation: {
    submitShiftReport: async(_root,args,context) => {
      const currentStation = context.currentStation

      //console.log(args)

      if (!(currentStation && currentStation.id.toString() === args.station )) {
        throw new AuthenticationError('Invalid authentication')
      }

      try{
        let shiftReport
        /**If submitting the saved shift report then report will have Id */

        if (args.id ){
          shiftReport = await ShiftReport.findById(args.id)
        }

        /**
         * THIS IS NOT IMPLEMENTED
         * If shift report doesnot already have the required fileds and the required fields are not provided  while submit throws error
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

        }*/

        /**If new shift report */
        if(!shiftReport){
          /**If shift report doesnot have all the required fields */
          if(!(args.startTime && args.endtime || args.staffs.length)){
            throw new UserInputError('Required arguments missing')
          }

          shiftReport = new  ShiftReport({
            station:{ id:currentStation.id, location: currentStation.location },
            shift: args.shift,
            startTime:args.startTime,
            endTime: args.endTime,
          })
        }

        const reportDateSplit = args.startTime.split(' ')[0].split('-')
        const date = new Date(Date.UTC(reportDateSplit[2],reportDateSplit[1]-1,reportDateSplit[0]))

        const staffAndTime = args.staffs.map( staff => {
          const user =  staff.name
          /**Verify the jwt token  return the decoded information */
          try{
            const data = jwt.verify(staff.signOffKey, config.JWT_SECRET)
            const timesheetData = {
              shiftReport:shiftReport.id,
              staff: data.id,
              station: {
                id: currentStation.id,
                location: currentStation.location } ,
              startTime: data.startTime,
              endTime:data.endTime,
              break:data.break,
              date : date ,
            }

            if (data.remark) {
              timesheetData.remarks = {
                title:'Remark Added', text: data.remark , date: data.endTime ,by: staff.name
              }
            }

            return timesheetData
          } catch (err){
            throw new AuthenticationError(`${user} cannot be authenticated, please signoff again : ${err}`)
          }


        })




        staffAndTime.forEach( async entry => {
          const splittedDateTime = entry.endTime.split(' ')
          const dateSplit = splittedDateTime[0].split('-')
          const timeSplit = splittedDateTime[1].split(':')

          const activeAtUTC = new Date (Date.UTC(dateSplit[2],dateSplit[1]-1,dateSplit[0],timeSplit[0],timeSplit[1]))

          await Staff.findByIdAndUpdate(entry.staff, {
            lastActive: { station: {
              id: currentStation.id,
              location: currentStation.location } ,
            activeAt:  activeAtUTC } } )


        })


        const timeSheetResult = await TimeSheet.insertMany(staffAndTime)

        await TimeSheet.populate(timeSheetResult,'staff')

        const ts = timeSheetResult.map( record => {
          const timesheet = {
            id: record.id,
            startTime:record.startTime,
            endTime:record.endTime ,
            staff: {
              name:record.staff.name
            }
          }
          return timesheet
        } )

        shiftReport.staffAndTime = ts

        shiftReport.tasks = []
        if (args.tasks.length > 0){

          const tasks = await Promise.all(args.tasks.map(async task => {

            /**If task has id field means task already exists on db */
            if(task.id){
              //console.log(task)
              const existingTask = await Task.findById(task.id).exec()

              /** If task is from the current handover - task will have one update with current handoverId and taskcreated action*/
              if(existingTask.updates && existingTask.updates.length === 1 && existingTask.updates[0].handoverId=== shiftReport.id  ){
                if(task.description ) {
                  existingTask.description = task.description
                }
                if(task.action ){
                  existingTask.status = task.action
                }
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
                  shiftReport.tasks = [task.id]
                }else{
                  shiftReport.tasks = [...shiftReport.tasks, (task.id)]
                }

                const newUpdate = {
                  action: task.action,
                  handoverId: shiftReport.id,
                  handoverDetail: `${currentStation.location} ${args.shift} Shift ${args.startTime.split(' ')[0]}` ,
                  note : task.newNote }

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

                throw new UserInputError(error,'Please check tasks inputs')
              }
              return existingTask

            }
            /**If task doesnot have id field means it is new task*/
            if(!task.id){
              const aircraft = await Aircraft.findById(task.aircraft)
              task.aircraft = {
                id:aircraft.id,
                registration:aircraft.registration,
                costumer: {
                  id: aircraft.costumer.id,
                  name: aircraft.costumer.name
                }
              }
              task.createdAt = args.endTime
              /*Setting action to Status*/
              if(task.action) {
                task.status = task.action
              }

              task.updates = [{
                handoverId: shiftReport.id,
                handoverDetail: `${currentStation.location} ${args.shift} Shift ${args.startTime.split(' ')[0]}` ,
                action: `TASK_CREATED_${task.action}` }]
              /**Remove action field */
              delete task.action
              return task
            }

          }))
          const insertedTask  =   await Task.insertMany( _.filter(tasks,task => !task.id))
          const taskIds = insertedTask.map(task => task._id)
          shiftReport.tasks = [...shiftReport.tasks,...taskIds]
          shiftReport.date = date
          await shiftReport.save()
        }

        /**
         * Setting last shift report from the station as complete
         */
        await ShiftReport.findOneAndUpdate({ flag:'MOST_RECENTLY_COMPLETED', 'station.id':currentStation.id },{ flag: 'COMPLETE' })

        /**
         * Setting the current report as Most recent report
         */
        shiftReport.flag = 'MOST_RECENTLY_COMPLETED'
        await shiftReport.save()


        try {
          await sendUShiftReportEmail(shiftReport, shiftReport.station.mailingList)
        // eslint-disable-next-line no-empty
        } catch (error) {
        }

        return shiftReport

      }catch(err){
        throw new Error(err.message)
      }
    },


    startReporting : async ( _root,args ) => {
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

    getShiftReport: async(_root,args,context) => {
      const currentStation = context.currentStation

      /**If station and flag is not set or id is not set */
      if (!(args.station && args.flag) && (!args.id || args.id === null) ){
        throw new UserInputError('Missing arguments')
      }
      /**If logged in as station then check if viewing station is same as requesting station */
      if (!args.id && !(currentStation && currentStation.id === args.station )) {
        throw new AuthenticationError('Invalid authentication')
      }

      let shiftReport

      try {
        if ( args.id) {
          //throw new Error('Testing')
          shiftReport = await ShiftReport.findById(args.id)
        } else{
          if(args.station )
            shiftReport = await ShiftReport.findOne({ 'station.id':args.station, flag:args.flag })
        }
        return shiftReport
      }
      catch(err) {
        throw new Error(err)
      }
    },

    getReportList : async (_root,args,context) => {

      const currentStation = context.currentStation
      const loggedInStaff = context.currentUser

      let searchFilters = {}
      if(args.filterBy === 'week'){
        const from = getDatefromWeek (args.number,args.year)
        searchFilters.date = {
          $gte: from,
          $lte: new Date(Date.UTC( from.getFullYear(), from.getMonth(), from.getDate()+6, 23, 59,59))
        }
      }
      if(args.filterBy === 'month'){
        const to = getLastDateFromMonth (args.number,args.year)
        searchFilters.date = {
          $gte: new Date(Date.UTC( args.year, args.number, 1)),
          $lte: new Date(Date.UTC( to.getFullYear(), to.getMonth(), to.getDate(), 23, 59,59))
        }
      }
      if(!(loggedInStaff || currentStation)) {
        throw new AuthenticationError ('You must authenticate for this action')
      }

      if(currentStation){
        if(args.stations.length > 1 || args.stations[0] !== currentStation.id){
          throw new Error('Permission denied')
        }
        searchFilters['station.id']  = currentStation.id
      }

      if(loggedInStaff){
        const permittedStations =loggedInStaff.permission.station.edit.map(station => station.toString())
        if(!(loggedInStaff.permission.admin || args.stations.some( station => !permittedStations.includes(station)))){
          throw new Error('Permission denied')
        }
        searchFilters['station.id']  = { $in:args.stations }
      }

      //console.log(searchFilters,args)
      const allReports = await ShiftReport.find({ ... searchFilters })
      return allReports

    },

    getShiftReportByShift: async(_root,args,_context) => {
      const report = await ShiftReport.findOne(args)

      return report

    }
  },


}

module.exports = shiftReportResolver