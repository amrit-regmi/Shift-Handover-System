const Station = require('../models/Station')
const Costumer = require('../models/Costumer')
const Staff = require ('../models/Staff')
const { UserInputError, AuthenticationError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')
const ObjectId = require('mongoose').Types.ObjectId


const stationResolver = {
  Query: {
    allStations: async (_root,args,context) => {
      let stations
      const filter = {}
      if(args.detailed){
        const loggedInStaff = context.currentUser
        /**Basic station list can be provided without autehntication
         *  but for detailed list only the station within staffs edit right is provided
         * or staff has add rights thaen can view all stations*/
        if (!loggedInStaff ){
          throw new Error('You do not have permission to view station list')
        }

        if(!(loggedInStaff.permission.admin || loggedInStaff.permission.station.add)){
          filter.station = { $in:loggedInStaff.permission.station.edit }
        }

      }
      stations =  await Station.find(filter)

      return stations

    },

    getStation: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      const currentStation = context.currentStation

      if(!args.id){
        throw new UserInputError('Please provide stationId')
      }

      if(!(loggedInStaff || currentStation) ){
        throw new AuthenticationError('Please log in with appropriate permission to view this station')
      }

      if(currentStation){
        if(currentStation.id !== args.id){

          throw new AuthenticationError('Station is not authinticated')
        }
      }

      if(loggedInStaff){
        if(!(loggedInStaff.permission.station.edit.includes(args.id) || loggedInStaff.permission.admin) ){
          throw new AuthenticationError('You do not have rights to view this station')
        }
      }

      return await Station.findById(args.id).populate({ path:'costumers', populate:({ path:'aircrafts' }) })



    }
  },
  Station: {
    staffList: async root => {
      const staffList =  Staff.find( { 'lastActive.station':  ObjectId(root.id) , 'lastActive.activeAt': { $gte: new Date ((new Date().getTime() - (24 * 60 * 60 * 1000))) }  } )
      return staffList
    },

    activeStaffs: async root => {
      /**Counts all the staff who are active within last 24 hours for given station */
      const count =  await Staff.collection.countDocuments( { 'lastActive.station':  ObjectId(root.id) , 'lastActive.activeAt': { $gte: new Date ((new Date().getTime() - (24 * 60 * 60 * 1000))) }  } )
      return count
    }

  },

  Mutation: {
    addStation : async (_root,args, context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin ||loggedInStaff.permission.station.add)){
        throw new Error('You do not have permission to add station')
      }
      const { stationKey,...inputargs } = { ...args }
      const key = await  bcrypt.hash(stationKey, 10)
      const station = new Station({ ...inputargs, stationKey: key })
      const costumers = args.costumers
      try{
        await station.save()
        await Costumer.bulkWrite(
          costumers.map((costumer) => ({
            updateOne: {
              filter: { id:costumer },
              update: { $addToSet:{ stations:  ObjectId(station.id ) }
              }
            }
          }))
        )

        return station
      } catch(err) {
        throw new UserInputError(err.message)
      }
    },


    assignCostumers: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to assign costumers to this station')
      }
      try {
        const station = await Station.findById(args.stationId,{ stationKey:0 })
        if(!station){
          throw new UserInputError('Couldnot find station')
        }

        station.costumers = [...new Set([...station.costumers, ...args.costumers])]
        await station.save({ validateModifiedOnly:true })

        if(args.costumers.length){
          forEach(args.costumers, async costumer => {
            await Costumer.findByIdAndUpdate( costumer ,{ $push:{ stations: args.stationId } })
          })
        }
        return await Station.populate(station,[{ path:'costumers', populate:{ path:'aircrafts' } }])
      } catch (error) {
        throw new Error(error.message)
      }
    },

    deleteStation: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to delete station')
      }
      try {
        await Station.findByIdAndDelete(args.stationId)
        return ({ type:'SUCCESS', message:'Station Removed' })

      } catch (error) {
        throw new Error(error.message)
      }
    },

    changeStationKey: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to change stationKey')
      }
      try{
        if(!args.stationKey || args.stationKey.length < 8 ){
          throw new Error('Invalid Station key')
        }
        const key = await  bcrypt.hash(args.stationKey, 10)
        await Station.findByIdAndUpdate(args.stationId, { stationKey: key })
        return ({ type:'SUCCESS', message:'Shift Removed' })
      }
      catch (error) {
        throw new Error(error.message)
      }
    },

    removeFromMailingList: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to change mailing list')
      }
      try {
        const station = await Station.findById(args.stationId)
        if(!station){
          throw new Error('Invalid Station')
        }
        station.mailingList = station.mailingList.filter(email => email !== args.email)
        await station.save({ validateModifiedOnly:true })
        return ({ type:'SUCCESS', message:'Email Removed' })
      } catch (error) {
        throw new Error(error.message)
      }



    },

    addToMailingList: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to change mailing list')
      }
      try {
        const station = await Station.findById(args.stationId)
        if(!station){
          throw new Error('Invalid Station')
        }
        station.mailingList = [...new Set([...station.mailingList, ...args.email])]
        await station.save({ validateModifiedOnly:true })
        return ({ type:'SUCCESS', message:'Emails Added' })

      } catch (error) {
        throw new Error(error.message)
      }



    },

    removeShift: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to modify shifts')
      }

      try {
        const station = await Station.findById(args.stationId)
        if(!station){
          throw new Error('Invalid Station')
        }
        station.shifts = station.shifts.filter(shift => shift.id !== args.id)
        await station.save({ validateModifiedOnly:true })
        return ({ type:'SUCCESS', message:'Station Removed' })

      } catch (error) {

        throw new Error(error.message)
      }



    },

    addShifts: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if (!(loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.includes(args.stationId))){
        throw new Error('You do not have permission to modify shifts')
      }
      try {
        const station = await Station.findById(args.stationId)
        if(!station){
          throw new Error('Invalid Station')
        }
        station.shifts = [...station.shifts, ...args.shifts ]
        await station.save({ validateModifiedOnly:true })

        return station.shifts
      } catch (error) {
        throw new Error(error.message)
      }



    },


    loginToStation : async (_root,args) => {
      const station = await Station.findById(args.id ).populate({ path:'costumers', populate:({ path:'aircrafts' }) })

      if(!(station && args.password ==='stationkey')){
        throw new UserInputError('Wrong Credentials')
      }

      const stationToken = {
        stationId: station.id,
        location: station.location
      }

      return  { value: jwt.sign(stationToken,config.JWT_SECRET),id: station.id, location:station.location  }
    }

  }
}


module.exports = { stationResolver }