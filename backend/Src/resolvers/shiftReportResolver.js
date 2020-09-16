const ShiftReport =  require('../models/ShiftReport')
const TimeSheet = require('../models/TimeSheet')
const Task = require('../models/Task')
const { UserInputError,AuthenticationError } = require('apollo-server')


const shiftReportResolver = {
  Mutation: {
    submitShiftReport: async (root,args) => {
      try{
        // const shiftReport = await ShiftReport.findById(args.id)
        const shiftReport = new  ShiftReport({
          station:args.station,
          shift: args.shift,
          startTime:args.startTime,
          endTime: args.endTime,
        })

        const staffAndTime = args.staffs.map( staff => {
          staff.shiftReport = shiftReport.id
          return staff
        })
        const timeSheetResult = await TimeSheet.insertMany(staffAndTime)

        shiftReport.staffAndTime = timeSheetResult


        if (args.tasks.length > 0){
          const tasks = args.tasks.map(task => {
            task.createdAt = args.endTime
            return task
          })

          const taskIds  = await  Task.insertMany(tasks)
          shiftReport.tasks = taskIds
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

        return await ShiftReport.populate(
          shiftReport,[
            {
              path:'station'
            },{
              path:'staffAndTime',
              populate:{
                path:'staff'
              }
            },{
              path:'tasks'
            }
          ])

      }catch(err){
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
      const shiftReport = await ShiftReport.findOne({ ...args }).populate([{ path:'station' },{ path:'staffAndTime',populate:{ path:'staff' } },{ path:'tasks' , populate:{ path:'aircraft',populate:{ path: 'costumer' } } }])
      return shiftReport
    }
  }

}

module.exports = shiftReportResolver