const { isExpired } = require('../utils/helper')
const Staff = require('../models/Staff')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { v1: uuidv1, validate: uuidValidate } = require('uuid')
const jwt  = require('jsonwebtoken')
const config = require('../../config')
const Permission = require('../models/Permission')
const { sendUserRegistrationEmail } = require('../mailer/sendUserRegistrationEmail')
const bcrypt = require('bcrypt')
const { sendPasswordResetEmail } = require('../mailer/sendPasswordResetEmail')


const staffResolver = {
  Query: {
    /*Returns all staff with sensitive field omitted*/
    allStaff: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      const station = context.currentStation
      /**If minimal is set return only name and id only if logged in as station or staff */
      if(args.minimal){
        if(!(station || loggedInStaff )){
          throw new AuthenticationError('You must be logged in to view staff list')
        }
        const minStaff = await Staff.find({},{ id:1,name:1 } )
        return minStaff
      }

      /**If args.station is set then station must be authenticated or staff should have right */
      if(!loggedInStaff ){
        throw new AuthenticationError('You must be logged in to view staff list')
      }

      if(loggedInStaff && (loggedInStaff.permission.admin || loggedInStaff.permission.staff.view || loggedInStaff.permission.staff.edit || loggedInStaff.permission.staff.add)){
        const staffs =  await Staff.find({ ...args },{ username:0,passwordHash:0,registerCode:0,resetCode:0 }).populate({ path:'lastActive.station' })
        return staffs
      }

      throw new AuthenticationError('You do not have proper authorization for this action')




    },

    getStaffName: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      const station = context.currentStation
      if(!(station || loggedInStaff )){
        throw new AuthenticationError('You must be logged in to view staff list')
      }
      const minStaff = await Staff.findById(args.id)
      if(minStaff) return minStaff.name
      return 'Unknown'
    },

    /*Returns staff by ID or registraion Code*/
    getStaff: async(_root,args, context) => {

      const loggedInStaff = context.currentUser
      /*If Id is set then returns staff values except password / registercode and resetcode */
      if (args.id && args.id !== null  && args.id !== undefined){

        /** If staff has permission to view staff information */
        if((loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin || loggedInStaff.permission.staff.view ))|| args.id === loggedInStaff.id) {

          /**If staff has permission to edit staff then send permission info */
          if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {

            const t =   await Staff.findById(args.id,{ passwordHash:0,resetCode:0 } ).populate({ path:'permission lastActive.station' , populate: { path: 'station.edit timesheet.edit timesheet.view timesheet.sign ' ,model:'Station' ,select:'id location' }   })
            return t
          }

          else{
            const t = await Staff.findById(args.id,{ passwordHash:0,registerCode:0,resetCode:0 } ).populate({ path:'lastActive.station' }).select('-permission')
            return t
          }

        }else{
          throw new AuthenticationError('User do not have rights to view staff information')
        }
      }

      /* If registrCode is set then checks the validity code and returns existing details */
      if (args.registerCode) {

        if(!uuidValidate(args.registerCode)){
          throw new Error('Registration code Invalid')
        }

        if(isExpired(args.registerCode,48)){
          throw new Error('Registration code has expired, please contact your supervisor' )

        }
        const t = await Staff.findOne({ ...args },{ name:1 })
        if(!t){
          throw new Error('Registration code Invalid')
        }

        return t
      }

    },
    verifyUsername: async (_root,args) => {
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
    addStaff : async (_root,args,context) => {
      const registerCode = uuidv1()
      const tempUserName = uuidv1()
      const loggedInStaff = context.currentUser

      if (loggedInStaff.permission && (loggedInStaff.permission.staff.add ||loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {
        const staff = new Staff({ ...args, registerCode:registerCode, username: tempUserName })
        const permission = new Permission({ staffId: staff.id })
        staff.permission = permission.id
        try {
          await staff.save()
          await permission.save()

          await sendUserRegistrationEmail(registerCode, args.name, args.email)

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

    resetRegisterCode: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin) && args.id) {
        const registerCode = uuidv1()
        try {
          const staff =  await Staff.findById(args.id)
          staff.registerCode = registerCode
          await staff.save()

          await sendUserRegistrationEmail(registerCode, staff.name, staff.email)
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
    registerStaff: async(_root, args) => {
      if(!uuidValidate(args.registerCode)){
        throw new Error('Registration code Invalid')
      }

      if(isExpired(args.registerCode,48)){
        throw new Error('Registration code has expired, please contact your supervisor')
      }

      try {
        /*Update and reset the registration code to null*/
        const staff = await Staff.findOne({ registerCode: args.registerCode })

        if(!staff){
          throw new UserInputError('Incorrect Registration Code ')
        }
        staff.registerCode = undefined
        staff.username = args.username
        staff.passwordHash = await  bcrypt .hash(args.password, 10)
        await staff.save()
        return { status:'SUCCESS',message:'User registration successfull' }
      }catch (error){

        throw new UserInputError(error.message)
      }

    },

    /**Edit Staff Informatiion  */
    staffEdit : async (_root,args,context) => {

      try {
        const loggedInStaff = context.currentUser
        if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {
          const { id, ...toUpdate } = { ...args }
          const staff = await Staff.findByIdAndUpdate(id,{ ...toUpdate }, { new: true, runValidators: true }).select('-permission')
          return staff

        }else{
          throw new AuthenticationError('User do not have permission for this action')
        }

      } catch (error) {
        throw new UserInputError(error.message)
      }


    },
    /**
     * Generate the password reset link and send email to linked email address
    */

    resetPasswordReq: async (_root,args) => {
      if(args.id && args.id!== null && args.id !== undefined){
        const resetCode = uuidv1()
        try{  const staffById = await Staff.findByIdAndUpdate(args.id,{ resetCode:resetCode })
          await sendPasswordResetEmail(resetCode,staffById.name,staffById.email)
          return({ status:'SUCCESS', message: `Password resetlink  sent to ${staffById.name}`  })
        }
        catch (error){
          throw new Error(error.message)
        }
      }
    },

    /**
     * If resetCode is set then checks and update the password
     * if password is set and user is verified sets new password
    */

    resetPassword: async (_root,args) => {
      if(args.resetCode && args.password){

        if(!uuidValidate(args.resetCode)){
          throw new Error('Reset code Invalid')
        }

        if(isExpired(args.resetCode,0.5)){ //0.5 hours is 30 minutes
          throw new Error('Reset code has expired, please contact your supervisor')
        }

        const staff = await Staff.findOne({ resetCode: args.resetCode })
        if (staff){
          staff.passwordHash = await  bcrypt.hash(args.password, 10)
          /*set reset code to null*/
          staff.resetCode = undefined
          try {
            await staff.save()
            return({ status:'SUCCESS', message: 'Password reset, login now'  })
          }
          catch (error){
            throw new Error(error.message)
          }
        }else{
          throw new Error('Reset code Invalid')
        }
      }else{
        throw new Error('Missing Arguments')
      }


    },

    changePassword: async (_root,args, context ) => {
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

      staff.passwordHash = await  bcrypt .hash(args.newPassword, 10)
      await staff.save()
      return({ status:'SUCCESS', message: 'Password reset'  })

    },

    setStaffStatus: async (_root,args,context) => {
      const loggedInStaff = context.currentUser
      if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {
        if(!args.id){
          throw new UserInputError('Missing required Fields')
        }

        await Staff.findByIdAndUpdate(args.id,{ $set :{ disabled:args.disabled } })

        return({ status:'SUCCESS', message: 'Staff status updated'  })


      }
      else{
        throw new AuthenticationError('You not have rights fot this action ')
      }
    },

    staffDelete: async(_root,args,context) => {
      const loggedInStaff = context.currentUser
      if(loggedInStaff.permission && (loggedInStaff.permission.staff.edit || loggedInStaff.permission.admin)) {
        if(!args.id){
          throw new UserInputError('Missing required Fields')
        }
        await Staff.findByIdAndDelete(args.id)
        return({ status:'SUCCESS', message: 'Staff Deleted'  })
      }
      else{
        throw new AuthenticationError('You not have rights fot this action ')
      }

    },

    staffLogin : async (_root,args) => {
      if(!(args.username && args.password)){
        throw new UserInputError('Username and password is required')
      }
      const staff = await Staff.findOne({ username:args.username }).populate({ path:'permission' , populate: { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' } , select:'id staff station timesheet admin'   })
      if(!staff)  throw new AuthenticationError ('Check username and password')

      if(staff.disabled){
        throw new AuthenticationError ('Your Account is disabled, please contact your supervisor.')
      }

      if(staff &&  !bcrypt.compare(args.password, staff.passwordHash )){

        throw new AuthenticationError('Check username and password')
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