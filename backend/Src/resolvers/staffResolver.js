const { isExpired } = require('../utils/helper')
const Staff = require('../models/Staff')
const { UserInputError,ApolloError, AuthenticationError } = require('apollo-server')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')
const jwt  = require('jsonwebtoken')
const config = require('../../config')


const staffResolver = {
  Query: {
    /*Returns all staff with sensitive field omitted*/
    allStaff: async (root,args) => {
      const staffs =  await Staff.find({ ...args },{ username:0,passwordHash:0,registerCode:0,resetCode:0 })
      return staffs
    },

    /*Returns staff by ID or registraion Code*/
    getStaff: async(root,args) => {
      /*If Id is set then returns staff values except username / password / registercode and resetcode */
      console.log(args)
      if (args.id && args.id !== null  && args.id !== undefined){
        return  await Staff.findById(args.id,{ passwordHash:0,registerCode:0,resetCode:0 } )
      }

      /* If registrCode is set then checks the validity code and returns existing details */
      if (args.registerCode) {
        if(!uuidValidate(args.registerCode)){
          throw new ApolloError('Registration code Invalid')
        }

        if(isExpired(args.registerCode,48)){
          throw new ApolloError('Registration code has expired, please contact your supervisor' )

        }

        return await Staff.findOne({ ...args })
      }

    }
  },

  Mutation: {
    /*Create staff with initial information and send the register code to staff to complete registration*/
    addStaff : async (root,args) => {
      const registerCode = uuidv4()
      const staff = new Staff({ ...args,registerCode:registerCode })
      try {
        await staff.save()
        /*
          To DO:
          Send Email to Staff to set Username/Password with register link
        */
        return ({ registerCode:registerCode })
      }
      catch (error){
        throw new UserInputError(error.message)
      }
    },

    /*
    Complete staff registration from the registration Link
     */
    registerStaff: async(root, args) => {

      if(!uuidValidate(args.registerCode)){
        throw new ApolloError('Registration code Invalid')
      }

      if(isExpired(args.registerCode,48)){
        throw new ApolloError('Registration code has expired, please contact your supervisor')
      }

      try {
        /*Update and reset the registration code to null*/
        const staff = await Staff.findOneAndUpdate({ registerCode: args.registerCode },{ ...args,registerCode: null,password: 'passwordHash' })
        if(!staff){
          throw new UserInputError('Incorrect Registration Code ')
        }
        console.log(staff.registerCode)
        return staff
      }catch (error){
        throw new UserInputError(error.message)
      }

    },
    /*Reset the password, if args.id is set sends reset link , if resetCode is set then checks and update the password*/

    resetPassword: async (root,args) => {
      if(args.id && args.id!== null && args.id !== undefined){
        const resetCode = uuidv4()
        console.log(args.id)
        const staffById = await Staff.findByIdAndUpdate(args.id,{ resetCode:resetCode })
        /*
        To DO:
        Send email to user with reset link
        */
        console.log(resetCode)
        return({ status:'SUCCESS', message: `Password resetlink  sent to ${staffById.name}`  })
      }

      if(args.resetCode && args.password){

        if(!uuidValidate(args.resetCode)){
          throw new ApolloError('Reset code Invalid')
        }

        if(isExpired(args.resetCode,48)){
          throw new ApolloError('Reset code has expired, please contact your supervisor')
        }

        const staff = await Staff.findOne({ resetCode: args.resetCode })
        if (staff){
          staff.passwordHash = 'passwordReset'
          /*set reset code to null*/
          staff.resetCode = null
          try {
            await staff.save()
            return({ status:'SUCCESS', message: 'Password reset, login now'  })
          }
          catch (error){
            throw new ApolloError(error.message)
          }
        }else{
          throw new ApolloError('Reset code Invalid')
        }
      }else{
        throw new ApolloError('Missing Arguments')
      }


    },


    staffLogin : async (root,args) => {
      if(!(args.username && args.password)){
        throw new UserInputError('Username and password is required')
      }
      const staff = await Staff.findOne({ username:args.username })
      if(!staff)  throw new AuthenticationError ('Cannot find staff with provided credentials')

      if(staff &&  staff.passwordHash !== args.password  ){

        throw new AuthenticationError('Cannot find staff with provided credentials')
      }

      const staffToken = {
        id: staff.id,
        name: staff.name
      }

      return  { value: jwt.sign(staffToken, config.JWT_SECRET),name: staff.name, id:staff.id  }
    }

  }

}



module.exports = { staffResolver }