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
    },

    verifyAircraftRegistration: async(_root,args) => {
      const regs = args.registrations.split(',')
      const res = []

      await Promise.all(
        regs.map (async (reg) => {
          const found = await Aircraft.findOne({ registration: reg.trim().toUpperCase() })
          if (found){
            console.log(found)
            res.push(found.registration)
          }
        })
      )

      return res
    }

  },

}


module.exports = { aircraftResolver }