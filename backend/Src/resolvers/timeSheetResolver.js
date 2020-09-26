const TimeSheet =  require('../models/TimeSheet')
const Staff = require('../models/Staff')
const { UserInputError, AuthenticationError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')

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

    signOffTimeSheet: async (root,args) => {
      const signOffToken = {
        startTime: args.startTime,
        endTime: args.endTime
      }
      let staff

      if(args.username){
        staff = await Staff.find({ username:args.username })
        if(!staff && !args.password === 'staffPassword' ){
          throw new AuthenticationError('Cannot find staff with provided credentials')
        }
      }else if(args.idCardCode){
        staff = await Staff.find({ idCardCode:args.idCardCode })
        if(!staff){
          throw new AuthenticationError('Cannot find staff with provided credentials')
        }
      }else{
        throw new AuthenticationError('Cannot find staff with provided credentials')
      }

      signOffToken.id = staff.id
      return  { value: jwt.sign(signOffToken,config.JWT_SECRET,{ expiresIn: '12h' }),name: staff.name }

    }
  },

}

module.exports ={ timeSheetResolver }