const Costumer = require('../models/Costumer')
const Station = require('../models/Station')
const { UserInputError } = require('apollo-server')
const { forEach } = require('lodash')
const Aircraft = require('../models/Aircraft')

const costumerResolver = {
  Query: {
    allCostumers: async () => {
      const costumers =  await Costumer.find({}).populate(['stations','aircrafts'])
      return costumers
    },
    getCostumer: async(root,args) => {
      if (args.id){
        return  await Costumer.findById(args.id ).populate(['stations','aircrafts'])
      }
      return await Costumer.findOne({ ...args }).populate('costumers')
    }
  },

  Mutation: {
    addCostumer : async (root,args) => {

      console.log(args)
      const { aircrafts,stations } = { ...args }
      try{
        const costumer = new Costumer({ ...args })

        let insertedAircrafts =[]
        if(aircrafts.length){

          const aircrfatsToInsert = aircrafts.map(aircraft => {
            return { registration:aircraft , costumer: costumer.id }
          })
          insertedAircrafts =   await Aircraft.insertMany( aircrfatsToInsert)
        }
        costumer.aircrafts = insertedAircrafts

        await costumer.save()

        if(stations.length){
          forEach(stations, async station => {
            await Station.findByIdAndUpdate( station ,{ $push:{ costumers: costumer.id } })
          })
        }
        return  Costumer.populate(costumer,['stations','aircrafts'])
      } catch(err) {
        throw new UserInputError(err.message)
      }
    }
  }
}


module.exports = { costumerResolver }