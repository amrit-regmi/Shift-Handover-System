const Aircraft = require('../models/Aircraft')
const aircraftResolver = {
  Query: {
    allAircraft: async () => {
      const aircrafts =  await Aircraft.find({}).populate('costumer')
      return aircrafts
    },

    getAircraft: async(_root,args) => {
      if (args.id){
        return  await Aircraft.findById(args.id )
      }
      return await Aircraft.findOne({ ...args })
    }
  },

}


module.exports = { aircraftResolver }