const Station = require('../models/Station')
const Costumer = require('../models/Costumer')
const { UserInputError } = require('apollo-server')

const stationResolver = {
  Query: {
    allStations: async () => {
      const stations =  await Station.find({}).populate('costumers')
      return stations
    },

    getStation: async (root,args) => {
      if (args.id){
        return  await Station.findById(args.id ).populate('costumers')
      }
      return await Station.findOne({ ...args }).populate('costumers')
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
    }

  },

}


module.exports = { stationResolver }