const TimeSheet =  require('../models/TimeSheet')
const { UserInputError } = require('apollo-server')

const timeSheetResolver = {
  Mutation: {
    addToTimeSheet: async (root,args) => {
      const timeSheet = new TimeSheet({ ...args })
      try{
        await timeSheet.save()
        return timeSheet
      }catch(err){
        throw new UserInputError(err.message)
      }
    },
  },

}

module.exports ={ timeSheetResolver }