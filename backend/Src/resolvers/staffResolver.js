const { isExpired } = require('../utils/helper')
const Staff = require('../models/Staff')
const { UserInputError,ApolloError, AuthenticationError } = require('apollo-server')
const { v4: uuidv4, validate: uuidValidate } = require('uuid')
const jwt  = require('jsonwebtoken')
const config = require('../../config')
const Permission = require('../models/Permission')


const staffResolver = {
  Query: {
    /*Returns all staff with sensitive field omitted*/
    allStaff: async (root,args) => {
      const staffs =  await Staff.find({ ...args },{ username:0,passwordHash:0,registerCode:0,resetCode:0 })
      return staffs
    },

    /*Returns staff by ID or registraion Code*/
    getStaff: async(root,args, context) => {

      const loggedInStaff = context.currentUser
      /*If Id is set then returns staff values except password / registercode and resetcode */
      if (args.id && args.id !== null  && args.id !== undefined){

        /** If staff has permission to view staff information */
        if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin || loggedInStaff.permission.staff.view || args.id === loggedInStaff.id)) {

          /**If staff has permission to edit staff then send permission info */
          if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {

            const t =   await Staff.findById(args.id,{ passwordHash:0,resetCode:0 } ).populate({ path:'permission' , populate: { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' }   })
            return t
          }

          else{
            const t = await Staff.findById(args.id,{ passwordHash:0,registerCode:0,resetCode:0 } ).select('-permission')
            return t
          }

        }else{
          throw new AuthenticationError('User do not have rights to view staff information')
        }
      }

      /* If registrCode is set then checks the validity code and returns existing details */
      if (args.registerCode) {

        if(!uuidValidate(args.registerCode)){
          throw new ApolloError('Registration code Invalid')
        }

        if(isExpired(args.registerCode,48)){
          throw new ApolloError('Registration code has expired, please contact your supervisor' )

        }
        const t = await Staff.findOne({ ...args },{ name:1 })
        if(!t){
          throw new ApolloError('Registration code Invalid')
        }

        return t
      }

    },
    verifyUsername: async (root,args) => {
      if(args){
        const staff = await Staff.findOne({ username:args.username })
        if(staff){
          return { status:'ERROR',message:'Provided username already exist' }
        }else{
          return { status:'SUCCESS',message:'Username is valid' }
        }
      }
    },
  },



  Mutation: {
    /*Create staff with and send the register code to staff to complete registration and set username and password*/
    addStaff : async (root,args,context) => {
      const registerCode = uuidv4()
      const tempUserName = uuidv4()
      const loggedInStaff = context.currentUser
      if (loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin) ) {
        const staff = new Staff({ ...args, registerCode:registerCode, username: tempUserName })
        const permission = new Permission({ staffId: staff.id })
        staff.permission = permission.id
        try {
          await staff.save()
          await permission.save()
          /*
          To DO:
          Send Email to Staff to set Username/Password with register link
        */

          return staff
        }
        catch (error){
          throw new UserInputError(error.message)
        }
      }
      else{
        throw new AuthenticationError('User do not have permission for this action')
      }
    },

    resetRegisterCode: async (root,args,context) => {
      const loggedInStaff = context.currentUser
      if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin) && args.id) {
        const registerCode = uuidv4()
        try {
          await Staff.findByIdAndUpdate(args.id,{ registerCode:registerCode } )
          /*
            To DO:
            Send Email to Staff  with new register link
          */
          console.log(registerCode)
          return({ status:'SUCCESS', message: 'Register Code  reset'  })
        }
        catch (error){
          throw new UserInputError(error.message)
        }

      }
      else{
        throw new AuthenticationError('User do not have permission for this action')
      }



    },

    /*
    Complete staff registration from the registration Link
     */
    registerStaff: async(root, args) => {
      console.log(args)
      if(!uuidValidate(args.registerCode)){
        throw new ApolloError('Registration code Invalid')
      }

      if(isExpired(args.registerCode,48)){
        throw new ApolloError('Registration code has expired, please contact your supervisor')
      }

      try {
        /*Update and reset the registration code to null*/
        const staff = await Staff.findOne({ registerCode: args.registerCode })

        if(!staff){
          throw new UserInputError('Incorrect Registration Code ')
        }
        staff.registerCode = undefined
        staff.username = args.username
        staff.paddword = 'password'
        await staff.save()
        return { status:'SUCCESS',message:'User registration successfull' }
      }catch (error){

        throw new UserInputError(error.message)
      }

    },

    /**Edit Staff Informatiion  */
    staffEdit : async (root,args,context) => {

      const loggedInStaff = context.currentUser
      if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {
        const { id, ...toUpdate } = { ...args }
        const staff = await Staff.findByIdAndUpdate(id,{ ...toUpdate }, { new: true, runValidators: true }).select('-permission')
        console.log(staff)
        return staff

      }else{
        throw new AuthenticationError('User do not have permission for this action')
      }

    },
    /**
     * Generate the password reset link and send email to linked email address
    */

    resetPasswordReq: async (root,args) => {
      if(args.id && args.id!== null && args.id !== undefined){
        const resetCode = uuidv4()
        const staffById = await Staff.findByIdAndUpdate(args.id,{ resetCode:resetCode })
        /*
        To DO:
        Send email to user with reset link
        */
        console.log(resetCode)
        return({ status:'SUCCESS', message: `Password resetlink  sent to ${staffById.name}`  })
      }
    },

    /**
     * If resetCode is set then checks and update the password
     * if password is set and user is verified sets new password
    */

    resetPassword: async (root,args) => {
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
          staff.resetCode = undefined
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

    changePassword: async (root,args, context ) => {
      const loggedInStaff = context.currentUser
      if(!(args.password && args.newPassword && args.id )){
        throw new UserInputError('Missing required Fields')
      }

      if( loggedInStaff.id !== args.id) {
        throw new AuthenticationError ('Invalid Authentication')
      }
      const staff = await Staff.findById(args.id)

      if( !staff || (staff && staff.passwordHash !== args.password)){
        throw new AuthenticationError('Cannot find staff with provided credentials')
      }

      staff.passwordHash = args.newPassword
      await staff.save()
      return({ status:'SUCCESS', message: 'Password reset'  })

    },

    staffLogin : async (root,args) => {
      if(!(args.username && args.password)){
        throw new UserInputError('Username and password is required')
      }
      const staff = await Staff.findOne({ username:args.username }).populate({ path:'permission' , populate: { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' } , select:'id staff station timesheet admin'   })

      console.log(staff.permission)

      if(!staff)  throw new AuthenticationError ('Cannot find staff with provided credentials')

      if(staff &&  staff.passwordHash !== args.password  ){

        throw new AuthenticationError('Cannot find staff with provided credentials')
      }



      const staffToken = {
        id: staff.id,
        name: staff.name
      }

      return  { value: jwt.sign(staffToken, config.JWT_SECRET),name: staff.name, id:staff.id , permission:staff.permission }
    }

  }

}



module.exports = { staffResolver }