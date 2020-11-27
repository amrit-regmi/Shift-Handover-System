const TimeSheet =  require('../models/TimeSheet')
const ShiftReport=  require('../models/ShiftReport')
const Staff = require('../models/Staff')
const { UserInputError, AuthenticationError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const { sleep, getDatefromWeek ,getLastDateFromMonth, getMonthName, toDate, getWeek, formatDate } = require('../utils/helper')
const { v4: uuidv4 } = require('uuid')
const _ = require('lodash')



const timeSheetResolver = {
  Mutation: {
    addToTimeSheet: async (root,args,context) => {
      const staff = context.currentUser
      let timeSheet
      /**If args.id is set  then it is treated as update request*/
      if(args.id){
        timeSheet = await TimeSheet.findById(args.id)
        if(!timeSheet){
          throw new UserInputError('Cannot find timesheet')
        }
        /**If the user updating the timesheet is different then the logged in user check for permission */
        if( !timeSheet.staff.equals(staff.id) && !staff.permission.timesheet.edit){
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
        if(!(args.startTime && args.endTime && args.shift && args.station)){
          throw new UserInputError('Required fields are missing')
        }
        /**If handoverId is  set then it must match with station and shift */
        if(args.handover )
        {
          const handover = await ShiftReport.findById(args.handover)

          if(!handover.station.equals(args.station) || handover.shift !== args.shift ){
            throw new UserInputError('Provided station/shift does not match with shift report ')
          }

        }
        /**If the user adding to the timesheet is different then the logged in user check for permission  */
        if( !args.staff === staff.id){
          if(!staff.permission.timesheet.edit.includes(args.station)){
            throw new AuthenticationError( 'User doesnot have rights to add timesheet to specified station')
          }


        }

        const reportDateSplit = args.startTime.split(' ')[0].split('-')
        const date = new Date(Date.UTC(reportDateSplit[2],reportDateSplit[1]-1,reportDateSplit[0]))
        const tsArgs = {
          startTime: args.startTime ,
          endTime: args.endTime,
          break:args.break,
          date: date,
          remarks: args.remarks,
          station: args.station,
          shift: args.shift,
          staff: args.staff
        }
        if(args.handover){
          tsArgs.shiftReport = args.handover
        }

        timeSheet = new TimeSheet(tsArgs)
      }

      try{
        await timeSheet.save()
        await TimeSheet.populate(timeSheet, [ { path:'shiftReport staff station' , populate: { path: 'station' } }] )
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

          if(!staff ) throw new UserInputError('Cannot authenticate. check credentials')

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

      return  { value: jwt.sign(signOffToken,config.JWT_SECRET,{ expiresIn: '12h' }), name: staff.name ,startTime: args.startTime, endTime: args.endTime ,id: staff._id ,break:args.break }

    },

    approveTimeSheet: async(root,args,context) => {
      const staff = context.currentUser

      const timesheet = await TimeSheet.findById(args.id)
      if(!staff.permission.timesheet.sign.includes(timesheet.station)){
        throw AuthenticationError('You do not have rights to sign this timesheet')
      }

      if(args.status === 'APPROVED'){
        const remark = { title:'Approved' , date: formatDate(Date.parse(new Date())) ,by: staff.name }
        if(timesheet.status !== 'APPROVED'){
          timesheet.status = 'APPROVED'
          timesheet.remarks = [...timesheet.remarks,remark]
        }
      }
      else{
        if(timesheet.status === 'APPROVED'){
          timesheet.status= 'PENDING_APPROVAL'
          const remarks = [ ...timesheet.remarks ]
          remarks.pop()
          timesheet.remarks = remarks

        }
      }

      await timesheet.save()

      return timesheet

    },

    deleteTimeSheet: async(root,args,context) => {
      const staff = context.currentUser
      const timesheet = await TimeSheet.findById(args.id)

      if(!(staff.permission.timesheet.edit.includes(timesheet.station) || timesheet.staff.equals(staff.id))){
        throw new AuthenticationError('You do not have rights to delete this timesheet')
      }
      await timesheet.remove()
      return ({ status:'SUCCESS', message:'Record Deleted' })


    },

    requestClarification: async (root,args,context) => {
      const staff = context.currentUser
      const timesheet = await TimeSheet.findById(args.id)

      if(!(staff.permission.timesheet.edit.includes(timesheet.station) || timesheet.staff.equals(staff.id))){
        throw new AuthenticationError('You do not have rights to delete this timesheet')
      }

      const remarks = [ ...timesheet.remarks ]
      const remark = {
        title: 'Clearification Requested',
        text: args.clearify,
        date: formatDate(Date.parse(new Date())) ,
        by: staff.name
      }
      remarks.push(remark)

      timesheet.remarks = remarks


      await timesheet.save()
      return timesheet
    }
  },

  Query: {
    getTimeSheetByUser: async (root,args) => {
      let startDate
      let endDate
      let to

      console.log('getTimeSheetByUser')

      switch (args.filterDuration) {
      case 'week':
        startDate = getDatefromWeek(args.number,args.year)
        endDate = new Date(Date.UTC( startDate.getFullYear(), startDate.getMonth(), startDate.getDate()+6,23,59,59))
        break
      case 'month':
        to = getLastDateFromMonth (args.number,args.year)
        endDate = new Date(Date.UTC(to.getFullYear(),to.getMonth(),to.getDate(),23,59,59))
        startDate =  new Date(Date.UTC( args.year, args.number, 1))
        break
      default:
        break
      }

      const searchFilters = {
        staff: args.staff,
        date : {
          $gte: startDate,
          $lte: endDate
        },
      }



      const timesheets = await TimeSheet.find( searchFilters
      ).populate({ path:'shiftReport staff station' , populate: { path: 'station' } })
      return timesheets
    },

    getAllTimeSheets: async (root,args, context) => {
      const searchFilters = {}

      if(args.staff && args.staff.length > 0){
        searchFilters.staff = { $in: args.staff }
      }

      if(args.period === 'date'){
        if(!(args.from && args.to)){
          throw new UserInputError('Dates missing')
        }

        const from = new Date(toDate(args.from))
        const to = new Date(toDate(args.to))
        const utcFrom = new Date(Date.UTC(from.getFullYear(),from.getMonth(),from.getDate()))
        const utcTo = new Date(Date.UTC(to.getFullYear(),to.getMonth(),to.getDate(),23,59,59))


        searchFilters.date =  {
          $gte: utcFrom,
          $lte: utcTo
        }
      }

      if(args.period === 'week' || args.period === 'month') {
        if(!(args.number && args.year)){
          throw new UserInputError('Must provide week/month number and year')
        }

        if(args.period === 'week'){
          const from = getDatefromWeek(args.number,args.year)
          searchFilters.date = {
            $gte: from,
            $lte: new Date(Date.UTC( from.getFullYear(), from.getMonth(), from.getDate()+6, 23, 59,59))
          }
        }

        if(args.period === 'month'){
          const to = getLastDateFromMonth (args.number,args.year)
          searchFilters.date = {
            $gte: new Date(Date.UTC( args.year, args.number, 1)),
            $lte: new Date(Date.UTC( to.getFullYear(), to.getMonth(), to.getDate(), 23, 59,59))
          }
        }
      }

      if(args.stations && args.stations.length > 0 ) {
        searchFilters.station = { $in : args.stations }
      }

      const timesheets = await TimeSheet.find( searchFilters
      ).populate({ path:'shiftReport staff station' , populate: { path: 'station' } }).lean()

      let mod1 = timesheets.reduce((aggregatedTimesheet,c) => {

        let periodTitle = ''

        const d = new Date(c.date)

        if(args.period === 'week' || args.groupBy === 'week'){
          periodTitle = `Week ${getWeek(d)} ${d.getFullYear()}`
        }
        else
        {
          periodTitle = `${getMonthName(d.getMonth())} ${d.getFullYear()}`
        }

        if(! aggregatedTimesheet[ periodTitle]){
          aggregatedTimesheet[ periodTitle] = {}
        }

        if(!aggregatedTimesheet[ periodTitle] [c.staff.name]){

          aggregatedTimesheet[ periodTitle] [c.staff.name] = {
            id:'',
            station: {},
            itemsPending: 0,
            totHours:0,
          }
        }
        const station  =  aggregatedTimesheet[ periodTitle][c.staff.name].station

        const stationName  = c.station && c.station.location || 'UNKNOWN'
        if(station[stationName]){
          station[stationName] = station[stationName] + 1
        }else{
          station[stationName] = 1

        }



        let itemsPending = aggregatedTimesheet[ periodTitle][c.staff.name].itemsPending

        if( c.status !=='APPROVED') {
          itemsPending = itemsPending +1
        }


        const tot =  (((toDate(c.endTime) - toDate(c.startTime) )/ (60*1000*60)) - (c.break || 0)/60).toFixed(1)
        const totHours = parseFloat(aggregatedTimesheet[ periodTitle][c.staff.name].totHours) +parseFloat(tot)

        aggregatedTimesheet[ periodTitle][c.staff.name] = {
          id: c.staff._id,
          station : station ,
          itemsPending : itemsPending,
          totHours: totHours
        }



        return aggregatedTimesheet
      } ,{})

      if(args.filterStatus){
        mod1 = _.mapValues(mod1,(staffs) => {
          return _.pickBy(staffs, staff => {
            if(args.filterStatus ==='approved') {
              return staff.itemsPending === 0
            }
            return staff.itemsPending > 0}
          )
        })


      }

      const orderedTimeSheets = {}
      _(mod1).keys().sort().reverse().each((key) => orderedTimeSheets[key] = mod1[key])

      console.log(orderedTimeSheets)

      return orderedTimeSheets
    }

  }

}

module.exports ={ timeSheetResolver }