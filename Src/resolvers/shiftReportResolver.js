const ShiftReport =  require('../models/ShiftReport')
const TimeSheet = require('../models/TimeSheet')
const Task = require('../models/Task')
const { UserInputError } = require('apollo-server')
const Station = require('../models/Station')


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
            task.shiftReport = shiftReport.id
            task.createdAt = args.endTime
            return task
          })

          const taskIds  = await  Task.insertMany(tasks)

          shiftReport.tasks = taskIds
        }

        await shiftReport.save()

        return await ShiftReport.populate(shiftReport,[{ path:'station' },{ path:'staffAndTime',populate:{ path:'staff' } },{ path:'tasks' }])

      }catch(err){
        throw new UserInputError(err.message)
      }
    },
  },

}

module.exports = shiftReportResolver