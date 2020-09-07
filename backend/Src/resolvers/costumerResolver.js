const Costumer = require('../models/Costumer')
const { UserInputError } = require('apollo-server')

const costumerResolver = {
  Query: {
    allCostumers: async () => {
      const costumers =  await Costumer.find({}).populate('stations')
      return costumers
    },

    getCostumer: async(root,args) => {
      if (args.id){
        return  await Costumer.findById(args.id ).populate(['stations','aircrafts','staffs'])
      }
      return await Costumer.findOne({ ...args }).populate('costumers')
    }
  },

  Mutation: {
    addCostumer : async (root,args) => {
      const costumer = new Costumer({ ...args })
      try{
        await costumer.save()
        return  Costumer.populate(costumer,'stations')
      } catch(err) {
        throw new UserInputError(err.message)
      }
    }

  }

}


module.exports = { costumerResolver }