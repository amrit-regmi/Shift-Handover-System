const Costumer = require('../models/Costumer')
const Station = require('../models/Station')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { forEach } = require('lodash')
const Aircraft = require('../models/Aircraft')

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
      const { aircrafts,stations } = { ...args }
      try{
        const costumer = new Costumer({ ...args })

        let insertedAircrafts =[]
        if(aircrafts.length){

          const aircrfatsToInsert = aircrafts.map(aircraft => {
            return { registration:aircraft , costumer: costumer.id }
          })
          insertedAircrafts =   await Aircraft.insertMany( aircrfatsToInsert,{ ordered:false })
        }
        costumer.aircrafts = insertedAircrafts

        await costumer.save()

        if(stations.length){
          forEach(stations, async station => {
            await Station.findByIdAndUpdate( station ,{ $push:{ costumers: costumer.id } })
          })
        }
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
        const costumer = await Costumer.findById(args.costumer)
        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }
        costumer.keyContacts = [...costumer.keyContacts, ...args.keyContacts]
        await costumer.save()

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
        const costumer = await Costumer.findById(args.costumer)
        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        costumer.stations = [...new Set([...costumer.stations,... args.stations])]

        await costumer.save()

        if(args.stations.length){
          forEach(args.stations, async station => {
            await Station.findByIdAndUpdate( station ,{ $push:{ costumers: costumer.id } })
          })
        }

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
        const costumer = await Costumer.findById(args.costumer)
        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }
        let aircrafts = []
        if(args.registration.length ) {
          const aircrfatsToInsert = args.registration.map(aircraft => {
            return { registration:aircraft.trim() , costumer: costumer.id }
          })
          aircrafts = await Aircraft.insertMany(aircrfatsToInsert,{ ordered:false })
        }

        costumer.aircrafts = [...costumer.aircrafts,...aircrafts]
        await costumer.save()

        const aircraftsMod = await Aircraft.find({
          '_id': { $in : aircrafts }
        })
        return aircraftsMod

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
        const costumer = await Costumer.findById(aircraft.costumer)
        if(costumer){
          costumer.aircrafts = costumer.aircrafts.filter( ac => ac.id.toString() !== args.id)
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
        const costumer = await Costumer.findById(args.costumer)
        if(!costumer){
          throw new UserInputError('Costumer does not exists')
        }

        costumer.keyContacts = costumer.keyContacts.filter(contact => {
          return contact.id.toString() !== args.id
        })

        await costumer.save()

        return({ status:'SUCCESS', message: 'Contact Removed'  })

      }catch(err){
        throw new UserInputError(err.message)
      }

    },

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

        costumer.stations = costumer.stations.filter (station => station.toString() !== args.station)
        await costumer.save()

        const station = await Station.findById(args.station)
        if(!station){
          throw new UserInputError('Specified station does not exist')
        }
        station.costumers = station.costumers.filter( costumer => costumer.toString() !== args.costumer)
        await station.save({ validateBeforeSave: false })

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

        if(costumer.stations.length > 0 ){

          await Promise.all(
            costumer.stations.map ( async station => {
              const st = await Station.findById(station)
              st.costumers =  st.costumers.filter( costumer => costumer.toString() !== args.costumer)
              await st.save({ validateBeforeSave: false })
            })
          )
        }

        return({ status:'SUCCESS', message: 'Successfully Removed Costumer'  })


      }catch(err){
        throw new UserInputError(err.message)
      }
    }

  }
}


module.exports = { costumerResolver }