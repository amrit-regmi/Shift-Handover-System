const Station = require('../models/Station')
const Costumer = require('../models/Costumer')

const stationResolver = {
  Query: {
    allStations: async () => {
      const stations =  await Station.find({})
      return stations
    }
  },

  Mutation: {
    addStation : async (root,args) => {
      const station = new Station({ ...args })
      const costumers = args.costumers

      Costumer.bulkWrite(
        costumers.map((costumer) => ({
          updateOne: {
            filter: { id:costumer.id },
            update: { $addToSet:{ stations: station.id }
            }
          }
        }))
      )

      return station
    }

  }

}


module.exports = { stationResolver }