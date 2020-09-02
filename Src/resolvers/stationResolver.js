const Station = require('../models/Station')
const Costumer = require('../models/Costumer')

const stationResolver = {
  Query: {
    allStations: async () => {
      const stations =  await Station.find({}).populate('costumers')
      return stations
    }
  },

  Mutation: {
    addStation : async (root,args) => {
      const station = new Station({ ...args })
      const costumers = args.costumers
      station.save((err,result) => {
        if (err){
          console.log(err)
          return
        }
        Costumer.bulkWrite(
          costumers.map((costumer) => ({
            updateOne: {
              filter: { id:costumer.id },
              update: { $addToSet:{ stations: result._id }
              }
            }
          }))
        )
      })
      return Station.populate(station,'costumers')
    }

  },

}


module.exports = { stationResolver }