const Station = require('../models/Station')
const Costumer = require('../models/Costumer')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { forEach } = require('lodash')
const Aircraft = require('../models/Aircraft')
//const Task = require('../models/Task')

const costumerResolver = {
  Query: {
    allCostumers: async (_root,_args,context) => {
      const loggedInStaff = context.currentUser
      /**User must be admin or have station edit right to view costumer list  */
      if(!(loggedInStaff && (loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.length > 0)) ){
        throw new AuthenticationError ('You do not have permission for this action ')
      }
      const costumers =  await Costumer.find({}).populate(['stations','aircrafts'])
      return costumers
    },

    getCostumer: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      const loggedInStation = context.currentStation
      let costumer

      if (args.id){
        costumer =  await Costumer.findById(args.id ).populate(['stations','aircrafts'])
      }else{
        costumer = await Costumer.findOne({ ...args }).populate(['stations','aircrafts'])
      }
      /**User must be admin or have station edit right or must be logged in as station that costumer belongs to to view costumer Info   */
      if(
        !((loggedInStaff && (loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.length > 0)) ||
        (loggedInStation && loggedInStation.costumers.includes(costumer.id))
        )){
        throw new AuthenticationError ('You do not have permission for this action ')
      }

      return costumer

    }
  },

  Mutation: {
    addCostumer : async (_root,args,context) => {

      const loggedInStaff = context.currentUser
      /**User must be admin to add costumer*/
      if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
        throw new AuthenticationError ('You do not have permission for this action ')
      }
      try{
        const costumer = new Costumer({ ...args })

        let insertedAircrafts =[]
        if(args.aircrafts.length){

          const aircrfatsToInsert = args.aircrafts.map(aircraft => {
            return { registration:aircraft , costumer: costumer.id }
          })
          insertedAircrafts =   await Aircraft.insertMany( aircrfatsToInsert,{ ordered:false })
        }
        costumer.aircrafts = insertedAircrafts

        await costumer.save()

        return  Costumer.populate(costumer,({ path:'stations aircrafts' }))

      } catch(err) {
        throw new UserInputError(err.message)
      }
    },

    addContact : async (_root,args,context) => {
      try {
        const loggedInStaff = context.currentUser
        /**User must be admin to make any changes to costumer*/
        if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
          throw new AuthenticationError ('You do not have permission for this action ')
        }
        const costumer = await Costumer.findByIdAndUpdate(args.costumer,{ $push: { keyContacts :{ $each: args.keyContacts } } },{ new:true })

        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        return costumer.keyContacts
      }

      catch(err){
        throw new UserInputError(err.message)
      }
    },

    addStationsToCostumer: async (_root,args,context) => {
      try{
        const loggedInStaff = context.currentUser
        /**User must be admin to make any changes to costumer*/
        if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
          throw new AuthenticationError ('You do not have permission for this action ')
        }

        console.log(args)

        if(!args.stations.length){
          throw new UserInputError('Station list cannot be empty')
        }

        const costumer = await Costumer.findByIdAndUpdate(args.costumer, { $addToSet: { stations: { $each: args.stations } } },{ new:true })

        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        /**Update the stations to include costumers */
        forEach(args.stations, async station => {
          await Station.findByIdAndUpdate( station ,{ $push:{ costumers: costumer.id } })
        })

        return Costumer.populate(costumer,'stations')

      }catch(err){
        throw new UserInputError(err.message)
      }

    }
    ,
    addAircrafts : async(_root,args,context) => {
      try {
        const loggedInStaff = context.currentUser
        /**User must be admin to make any changes to costumer*/
        if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
          throw new AuthenticationError ('You do not have permission for this action ')
        }

        if(!args.registration.length ) {
          throw new UserInputError('Aircraft List Cannot be Empty')
        }

        const costumer = await Costumer.findById(args.costumer)

        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        let aircrafts = []

        const aircrfatsToInsert = args.registration.map(aircraft => {
          return { registration:aircraft.trim() , costumer: costumer.id }
        })

        aircrafts = await Aircraft.insertMany(aircrfatsToInsert,{ ordered:false })

        await costumer.updateOne({ $addToSet: { aircrafts: { $each: aircrafts } } },{ new:true })

        return aircrafts

      } catch (e) {
        throw new UserInputError(e.message)
      }

    },

    removeAircraft: async (_root,args,context) => {
      try {
        const loggedInStaff = context.currentUser
        /**User must be admin to make any changes to costumer*/
        if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
          throw new AuthenticationError ('You do not have permission for this action ')
        }
        const aircraft = await Aircraft.findByIdAndDelete(args.id)

        if(!aircraft){
          throw new UserInputError('Aircrfat does not exists')
        }

        return({ status:'SUCCESS', message: ' Aircraft Removed'  })


      } catch (err) {
        throw new UserInputError(err.message)
      }

    },

    removeContact: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      /**User must be admin to make any changes to costumer*/
      if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
        throw new AuthenticationError ('You do not have permission for this action ')
      }
      try{
        const costumer = await Costumer.findByIdAndUpdate(args.costumer, { $pull: { keyContacts: { _id: args.id } } })
        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        return({ status:'SUCCESS', message: 'Contact Removed'  })

      }catch(err){
        throw new UserInputError(err.message)
      }

    },

    /**Deassosite station from costumer */
    removeCostumerStation: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      /**User must be admin or should have right to edit the concerned station*/
      if(!((loggedInStaff && (loggedInStaff.permission.admin )) || (loggedInStaff.permission.station.edit. includes(args.station))) ){
        throw new AuthenticationError ('You do not have permission for this action ')
      }
      try{
        const costumer = await Costumer.findById(args.costumer)
        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        const s = await Station.findByIdAndUpdate(args.station,{ $pull:{ costumers: args.costumer } })

        if(!s){
          throw new UserInputError('Specified station does not exist')
        }

        await costumer.updateOne(args.costumer,{ $pull:{ stations: args.station } })

        return({ status:'SUCCESS', message: 'Station Removed'  })

      }catch(err){
        throw new UserInputError(err.message)
      }

    },

    deleteCostumer: async (_root,args,context) => {
      try{
        const loggedInStaff = context.currentUser
        /**User must be admin to make any changes to costumer*/
        if(!(loggedInStaff && (loggedInStaff.permission.admin )) ){
          throw new AuthenticationError ('You do not have permission for this action ')
        }
        const costumer = await Costumer.findByIdAndDelete(args.costumer)

        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        return({ status:'SUCCESS', message: 'Successfully Removed Costumer'  })


      }catch(err){
        throw new UserInputError(err.message)
      }
    }

  }
}


module.exports = { costumerResolver }