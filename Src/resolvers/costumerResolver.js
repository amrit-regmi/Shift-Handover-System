const Costumer = require('../models/Costumer')

const costumerResolver = {
  Query: {
    allCostumers: async () => {
      const costumers =  await Costumer.find({}).populate('stations')
      return costumers
    }
  },

  Mutation: {
    addCostumer : async (root,args) => {
      const costumer = new Costumer({ ...args })
      costumer.save()

      return Costumer.populate(costumer,'stations')
    }

  }

}


module.exports = { costumerResolver }