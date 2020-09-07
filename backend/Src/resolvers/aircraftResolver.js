const Aircraft = require('../models/Aircraft')
const Costumer = require('../models/Costumer')
const { UserInputError } = require('apollo-server')
const aircraftResolver = {
  Query: {
    allAircraft: async () => {
      const aircrafts =  await Aircraft.find({}).populate('costumer')
      return aircrafts
    },

    getAircraft: async(root,args) => {
      if (args.id){
        return  await Aircraft.findById(args.id )
      }
      return await Aircraft.findOne({ ...args })
    }
  },

  Mutation: {
    addAircraft : async (root,args) => {
      const aircraft = new Aircraft({ ...args })
      try {
        await aircraft.save()
        await Costumer.findByIdAndUpdate(args.costumer,{ $addToSet:{ aircrafts: aircraft.id } })
        return Aircraft.populate(aircraft,'costumer')
      }
      catch (error){
        throw new UserInputError(error.message)
      }
    }

  }

}


module.exports = { aircraftResolver }