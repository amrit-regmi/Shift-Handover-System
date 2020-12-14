const Station = require('../models/Station')
const Costumer = require('../models/Costumer')
const Staff = require ('../models/Staff')
const { UserInputError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const ObjectId = require('mongoose').Types.ObjectId


const stationResolver = {
  Query: {
    allStations: async () => {
      const stations =  await Station.find({}).populate('costumers')
      return stations

    },

    getStation: async (root,args) => {
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
    addStation : async (_root,args) => {
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

  },

}


module.exports = { stationResolver }