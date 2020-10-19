const TimeSheet =  require('../models/TimeSheet')
const Staff = require('../models/Staff')
const { UserInputError, AuthenticationError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const { sleep, getDatefromWeek ,getDateFromMonth } = require('../utils/helper')
const { v4: uuidv4 } = require('uuid')
const Station = require('../models/Station')



const timeSheetResolver = {
  Mutation: {
    addToTimeSheet: async (root,args,context) => {

      console.log(args)

      const staff = context.currentUser
      let timeSheet
      /**If args.id is set  then it is treated as update request*/
      if(args.id){
        timeSheet = await TimeSheet.findById(args.id)
        if(!timeSheet){
          throw new UserInputError('Cannot find timesheet')
        }
        /**If the user updating the timesheet is different then the logged in user check for permission */
        console.log(timeSheet.staff,staff.id)
        if( !timeSheet.staff.equals(staff.id)){

          /**TODO : verify permission */
          throw new AuthenticationError('Permission denied')
        }

        if(args.startTime) timeSheet.startTime = args.startTime
        if(args.endTime) timeSheet.endTime = args.endTime
        if(args.break) timeSheet.break = args.break
        if(args.remarks) timeSheet.remarks = [...timeSheet.remarks,...args.remarks]
      }
      /**If args.id is not set  then it is treated as add request*/
      if(!args.id){
        /**If not start Time and endtime */
        if(!(args.startTime && args.endTime )){
          throw new UserInputError('Required fields are missing')
        }
        /**If handoverId is not set then must provide shift name and station */
        if(!args.handover && !(args.shift && args.station)){
          throw new UserInputError('Required fields are missing')
        }
        const reportDateSplit = args.startTime.split(' ')[0].split('-')
        const date = new Date(Date.UTC(reportDateSplit[2],reportDateSplit[1]-1,reportDateSplit[0]))
        const tsArgs = {
          startTime: args.startTime ,
          endTime: args.endTime,
          break:args.break,
          date: date,
          remarks: args.remarks
        }
        if(!args.handover){
          const station = await Station.findById(args.station)
          tsArgs.station =  station.location
          tsArgs.shift =  args.shift
        }else{
          tsArgs.handover = args.handover
        }

        /**If staff field is set then check add permission for logged in staff */
        if(args.staff){
          if(args.staff !==  staff.id){
            /**TODO : verify permission */
            throw new AuthenticationError('Permission denied')
          }
          tsArgs.staff= args.staff
        }else{
          tsArgs.saff = staff.id
        }


        timeSheet = new TimeSheet(tsArgs)
      }





      //const timeSheet = new TimeSheet({ ...args })
      try{
        await timeSheet.save()
        await TimeSheet.populate(timeSheet, [ { path:'shiftReport staff' , populate: { path: 'station' } }] )
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
        endTime: args.endTime,
        break: args.break
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
      return  { value: jwt.sign(signOffToken,config.JWT_SECRET,{ expiresIn: '12h' }), name: staff.name ,startTime: args.startTime, endTime: args.endTime ,id: staff._id ,break:args.break }

    }
  },

  Query: {
    getTimeSheetByUser: async (root,args) => {
      let startDate
      let endDate

      switch (args.filterDuration) {
      case 'week':
        startDate = getDatefromWeek(args.number,args.year)
        endDate = new Date(Date.UTC( startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+6))
        break
      case 'month':
        endDate = getDateFromMonth (args.number+1,args.year)
        startDate =  new Date(Date.UTC( args.year, args.number-1, 1))
        console.log(startDate)
        break
      default:
        break
      }

      const timesheets = await TimeSheet.find({
        staff: args.staff,
        date : {
          $gte: startDate,
          $lte: endDate
        }

      }
      ).populate({ path:'shiftReport staff' , populate: { path: 'station' } })
      return timesheets
    }

  }

}

module.exports ={ timeSheetResolver }