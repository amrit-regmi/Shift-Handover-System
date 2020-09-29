const TimeSheet =  require('../models/TimeSheet')
const Staff = require('../models/Staff')
const { UserInputError, AuthenticationError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const { sleep } = require('../utils/helper')

const { v4: uuidv4 } = require('uuid')

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
      /**Updating  data to timesheet model will be implemented here in future together with realtime reporting sync accross diffent computers
       * For now it only generates the token for staff which is used to verify the timesheet data when report is submitted.
      */

      //await sleep(5000)
      const signOffToken = {
        startTime: args.startTime,
        endTime: args.endTime
      }

      let staff

      /**If Additinal action is set check if reset or new user */
      if(args.additionalAction) {

        /**If reset sign the timesheet  and send reset code */
        if(args.additionalAction === 'reset'){
          staff = await Staff.findOne({ email: args.email })
          if(!staff) throw new UserInputError('Provided email address is not linked to any user')

          if(staff){
            const resetCode = uuidv4()
            staff.resetCode = resetCode
            try {
              await staff.save()
            } catch (err) {
              throw new UserInputError(err.message)
            }
          }
        }

        /**If register,create a user sign the timesheet with  the user and send register code */
        if(args.additionalAction === 'register'){
          if(!args.name &&  !args.email ) throw new UserInputError('Username and email must be provided')
          const registerCode = uuidv4()
          staff = new Staff({ name:args.name, email:args.email,registerCode:registerCode })
          try {
            await staff.save()
          } catch (err) {
            throw new UserInputError(err)
          }

          /**Email the register code to user to be implemented */
        }

        /**If update or remove */
        if (args.additionalAction === 'update' || args.additionalAction === 'remove'){
          staff = await Staff.findById(args.id)
          //console.log(staff)
          if(!staff ) throw new UserInputError('Cannot authenticate. check credentials')
          console.log(args)
          console.log(staff.username)
          if(args.username && staff.username !== args.username && staff.passwordHash !== args.password) throw new UserInputError('Cannot authenticate. Check username and password')
          if(args.idCardCode && staff.idCardCode !== args.idCardCode ) throw new UserInputError('Cannot authenticate with this idcard ')
        }
      }
      else
      /**If username is set check for username password combo */
      if(args.username){
        staff = await Staff.findOne({ username:args.username })
        if(!staff)  throw new AuthenticationError ('Cannot find staff with provided credentials')

        if(staff &&  staff.passwordHash !== args.password  ){

          throw new AuthenticationError('Cannot find staff with provided credentials')
        }
      }
      /**If barcode is set find user by barcode */
      else if(args.idCardCode){
        staff = await Staff.find({ idCardCode:args.idCardCode })
        if(!staff){
          throw new AuthenticationError('Cannot find staff with provided credentials')
        }

      }else {
        throw new AuthenticationError('Cannot find staff with provided credentials')
      }

      signOffToken.id = staff._id
      console.log(signOffToken)
      return  { value: jwt.sign(signOffToken,config.JWT_SECRET,{ expiresIn: '12h' }), name: staff.name ,startTime: args.startTime, endTime: args.endTime ,id: staff._id }

    }
  },

}

module.exports ={ timeSheetResolver }