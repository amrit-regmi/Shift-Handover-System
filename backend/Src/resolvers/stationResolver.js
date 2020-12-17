const Station = require('../models/Station')
const Costumer = require('../models/Costumer')
const Staff = require ('../models/Staff')
const { UserInputError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { forEach } = require('lodash')
const ObjectId = require('mongoose').Types.ObjectId


const stationResolver = {
  Query: {
    allStations: async () => {
      const stations =  await Station.find({}).populate('costumers')
      return stations

    },

    getStation: async (_root,args) => {
      if (args.id){

        return  await Station.findById(args.id ).populate({ path:'costumers', populate:({ path:'aircrafts' }) })
      }
      return await Station.findOne({ ...args }).populate({ path:'costumers', populate:({ path:'aircrafts' }) })
    }
  },
  Station: {
    staffList: async root => {
      const staffList =  Staff.find( { 'lastActive.station':  ObjectId(root.id) , 'lastActive.activeAt': { $gte: new Date ((new Date().getTime() - (24 * 60 * 60 * 1000))) }  } )
      return staffList
    },
    activeStaffs: async root => {
      /**Counts all the staff who are active within last 72 hours for given station */
      const count =  await Staff.collection.countDocuments( { 'lastActive.station':  ObjectId(root.id) , 'lastActive.activeAt': { $gte: new Date ((new Date().getTime() - (24 * 60 * 60 * 1000))) }  } )
      return count
    }

  },

  Mutation: {
    addStation : async (_root,args, _context) => {
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


    assignCostumers: async(_root,args,_context) => {
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

    deleteStation: async(_root,args,_context) => {
      try {
        await Station.findByIdAndDelete(args.stationId)
        return ({ type:'SUCCESS', message:'Station Removed' })

      } catch (error) {
        throw new Error(error.message)
      }
    },

    changeStationKey: async(_root,args) => {
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

    removeFromMailingList: async(_root,args) => {
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

    addToMailingList: async(_root,args) => {
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

    removeShift: async(_root,args) => {

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

    addShifts: async(_root,args) => {
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