const Staff = require('../models/Staff')
const { UserInputError,ApolloError } = require('apollo-server')
const aircraftResolver = {
  Query: {
    allStaff: async (root,args) => {
      const staffs =  await Staff.find({ ...args },{ username:0,passwordHash:0,registerCode:0,resetCode:0 })
      return staffs
    },

    getStaff: async(root,args) => {
      if (args.id && args.id !== null  && args.id !== undefined){
        return  await Staff.findById(args.id,{ username:0,passwordHash:0,registerCode:0,resetCode:0 } )
      }

      if (args.registerCode)
      /*TO DO:
        Code validity timecheck to be implemented
        if (!isValid(args.registerCode)){
        return ({error:"Register code expired, please contact your supervisor"})
      }
      return ({valid:true})
      */
        return await Staff.findOne({ ...args })
    }
  },

  Mutation: {
    /*Create staff with inital information and send the register code to staff to complete registration*/
    addStaff : async (root,args) => {
      const staff = new Staff({ ...args })
      try {
        await staff.save()
        /*
          Generate Register Code
          Send Email to Staff to set Username/Password
        */
      }
      catch (error){
        throw new UserInputError(error.message)
      }
    },

    /*
    Complete staff registration from the registration Link
     */
    registerStaff: async(root, args) => {
      /*
      TO DO:
      Code validity timecheck to be implemented
      if (!isValid(args.registerCode)){
        return ({error:"Register code expired, please contact your supervisor"})
      }
      */
      try {
        const staff = Staff.findOneAndUpdate({ registerCode: args.registerCode },{ ...args,registerCode: null,password: 'passwordHash' })
        return staff
      }catch (error){
        throw new UserInputError(error.message)
      }

    },

    resetPassword: async (root,args) => {
      if(args.id && args.id!== null && args.id !== undefined){
        const resetCode = 'dummyresetCode'
        const staffById = Staff.findByIdAndUpdate(args.id,{ resetCode:resetCode })
        /*
        To DO:
        Send email to user with reset link
        */
        return({ message: `Password resetlink  sent to ${staffById.name}`  })
      }
      /*
      TO DO :
      Code validity timecheck to be implemented
      if (args.resetCode && !isValid(args.resetCode)){
        return ({error:"Reset code expired, please contact your supervisor"})
      }
      */
      const staff = await Staff.findOne({ resetCode: args.resetCode })
      if (staff){
        staff.passwordHash = 'passwordHash'
        staff.resetCode = null
        try {
          await staff.save()
        }
        catch (error){
          throw new ApolloError(error.message)
        }
      }else{
        return { error:'Invalid Reset Code ' }
      }
    }

  }

}


module.exports = { aircraftResolver }