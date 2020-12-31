const ShiftReport =  require('../models/ShiftReport')
const TimeSheet = require('../models/TimeSheet')
const Task = require('../models/Task')
const { UserInputError,AuthenticationError } = require('apollo-server')
const _ = require('lodash')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const { sendUShiftReportEmail } = require('../mailer/shiftReportEmail')
const Staff = require('../models/Staff')

const shiftReportResolver = {
  Mutation: {
    submitShiftReport: async(_root,args,context) => {
      const currentStation = context.currentStation
      if (!(currentStation && currentStation.id !== args.id )) {
        throw new AuthenticationError('Invalid authentication')
      }

      try{
        let shiftReport
        /**If submitting the saved shift report then report will have Id */
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

        const reportDateSplit = args.startTime.split(' ')[0].split('-')
        const date = new Date(Date.UTC(reportDateSplit[2],reportDateSplit[1]-1,reportDateSplit[0]))

        const staffAndTime = args.staffs.map( staff => {
          const user =  staff.name
          /**Verify the jwt token  return the decoded information */
          try{
            const data = jwt.verify(staff.signOffKey, config.JWT_SECRET)
            return { shiftReport:shiftReport.id, staff: data.id, station: args.station , startTime: data.startTime, endTime:data.endTime, break:data.break, date : date ,
              remarks: {
                title:'Remark Added', text: data.remark , date: data.endTime ,by: staff.name
              } }
          } catch (err){
            throw new AuthenticationError(`${user} cannot be authenticated, please signoff again : ${err}`)
          }


        })




        staffAndTime.forEach( async entry => {
          const splittedDateTime = entry.endTime.split(' ')
          const dateSplit = splittedDateTime[0].split('-')
          const timeSplit = splittedDateTime[1].split(':')

          const activeAtUTC = new Date (Date.UTC(dateSplit[2],dateSplit[1]-1,dateSplit[0],timeSplit[0],timeSplit[1]))

          await Staff.findByIdAndUpdate(entry.staff, { lastActive: { station: entry.station , activeAt:  activeAtUTC } } )


        })


        const timeSheetResult = await TimeSheet.insertMany(staffAndTime)

        shiftReport.staffAndTime = timeSheetResult

        shiftReport.tasks = []
        if (args.tasks.length > 0){

          const tasks = await Promise.all(args.tasks.map(async task => {


            /**If task has id field means task already exists on db */
            if(task.id){
              //console.log(task)
              const existingTask = await Task.findById(task.id).exec()

              /** If task is from the current handover - task will have one update with current handoverId and taskcreated action*/
              if(existingTask.updates && existingTask.updates.length === 1 && existingTask.updates[0].handoverId=== shiftReport.id  ){
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

                const newUpdate = { action: task.action, handover: shiftReport.id, note : task.newNote }

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

              task.createdAt = args.endTime
              /*Setting action to Status*/
              if(task.action) {
                task.status = task.action
              }

              task.updates = [{ handoverId: shiftReport.id, action: `TASK_CREATED_${task.action}` }]
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
        await ShiftReport.findOneAndUpdate({ flag:'MOST_RECENTLY_COMPLETED', station:args.station },{ flag: 'COMPLETE' })

        /**
         * Setting the current report as Most recent report
         */
        shiftReport.flag = 'MOST_RECENTLY_COMPLETED'
        await shiftReport.save()

        const newReport = await   ShiftReport.populate( shiftReport,
          [
            {
              path:'station'
              ,
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
          ])


        try {
          await sendUShiftReportEmail(newReport, newReport.station.mailingList)
        // eslint-disable-next-line no-empty
        } catch (error) {
        }

        return newReport

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

      if (!(args.station && args.flag) && (!args.id || args.id === null) ){
        throw new UserInputError('Missing arguments')
      }


      if (!args.id && !(currentStation && currentStation.id !== args.id )) {
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
              ,
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
          ])

        /**Testing email send */
        //await sendUShiftReportEmail(shiftReport,shiftReport.station.mailingList)
        return shiftReport
      }
      catch(err) {
        throw new Error(err)
        //console.log(err)
      }
    },

    getReportList : async (_root,args,context) => {
      const currentStation = context.currentStation

      if (!args.stationId){
        const loggedInStaff = context.currentUser
        /**Only staff with station edit or admin permission can view all shiftreports for all station */
        if(loggedInStaff && (loggedInStaff.permission.admin  || (loggedInStaff.permission.station.edit.length > 0))){
          let allReports
          if (loggedInStaff.permission.admin){
            allReports = await ShiftReport.find({}).populate(
              [
                {
                  path:'station'
                  ,
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
              ])
          }
          else{
            allReports = await ShiftReport.find({ station: { $in: loggedInStaff.permission.station.edit } }).populate('station')
          }
          return allReports
        }

      }

      if (!currentStation || currentStation.id !== args.stationId ) {
        throw new AuthenticationError('Invalid authentication')
      }

      const shiftReports = await ShiftReport.find({ station:args.stationId }).populate(
        [
          {
            path:'station'
            ,
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
        ])
      return shiftReports

    },

    getShiftReportByShift: async(_root,args,_context) => {
      const report = await ShiftReport.findOne(args).populate(
        [
          {
            path:'station'
            ,
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
        ])
      return report

    }
  },


}

module.exports = shiftReportResolver