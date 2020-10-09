const Station = require('../models/Station')
const Costumer = require('../models/Costumer')
const { UserInputError } = require('apollo-server')
const config = require('../../config')
const jwt  = require('jsonwebtoken')

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

  Mutation: {
    addStation : async (root,args) => {
      const station = new Station({ ...args })
      const costumers = args.costumers
      try{
        await station.save()
        await Costumer.bulkWrite(
          costumers.map((costumer) => ({
            updateOne: {
              filter: { id:costumer.id },
              update: { $addToSet:{ stations: station.id }
              }
            }
          }))
        )

        return Station.populate(station,'costumers')
      } catch(err) {
        throw UserInputError(err.message)
      }
    },

    loginToStation : async (root,args) => {
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