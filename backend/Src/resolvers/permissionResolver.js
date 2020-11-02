const { AuthenticationError, UserInputError } = require('apollo-server')
const Permission = require('../models/Permission')
const _  = require('lodash')

const permissionResolver = {
  Mutation: {
    changePermission: async (root,args,context) => {
      const { id,...update }= { ...args }

      console.log(id ,args)
      const loggedInStaff = context.currentUser
      let permission

      /**If user is not logged in */
      if(!loggedInStaff){
        throw new AuthenticationError('User must logged in with appropriate permissions')
      }

      /**User cannot assign permission to himself */
      if(id === loggedInStaff.id){
        throw new AuthenticationError('User cannot  assign permission to himself')
      }
      /**Only user with sdmin permession can set admin permsission*/
      if(update.admin){
        if(loggedInStaff.permission && loggedInStaff.permission.admin){
          permission = await Permission.findByIdAndUpdate(id,update, { new:true }). populate( { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' })
          return permission
        }else{
          throw new AuthenticationError('User do not have permission for this action')
        }
      }


      /**Only user with staff edit permission can modify permission
       */
      if(loggedInStaff.permission && loggedInStaff.permission.staff.edit) {
        if(!id) throw new UserInputError('Missing required Fields')
        /** check if user is trying to assign permissions that user don't have */

        /**If station permission is set*/
        if(update.station){
          if(update.station.edit && !_.difference(update.station.edit,loggedInStaff.permission.station.edit).length){
            throw new AuthenticationError('User do not have right to assign edit permission for provided station')
          }
          if(update.station.add  && ! loggedInStaff.permission.station.edit){
            throw new AuthenticationError('User do not have right to assign add station permission')
          }
        }

        /**If timesheet permission is set*/
        if(update.timesheet){
          if(update.timesheet.edit && !_.difference(update.timesheet.edit,loggedInStaff.permission.timesheet.edit).length){
            throw new AuthenticationError('User do not have right to assign timesheet edit permission for provided station')
          }
          if(update.timesheet.view && !_.difference(update.timesheet.view,loggedInStaff.permission.timesheet.view).length){
            throw new AuthenticationError('User do not have right to assign timesheet view permission for provided station')
          }
          if(update.station.sign && !_.difference(update.timesheet.sign,loggedInStaff.permission.timesheet.sign).length){
            throw new AuthenticationError('User do not have right to assign timesheet view permission for provided station')
          }
        }

        /**If staff permission is set*/
        if(update.staff){
          if(update.staff.edit  && ! loggedInStaff.permission.staff.edit){
            throw new AuthenticationError('User do not have right to assign edit staff permission')

          }

          if(update.staff.view  && ! loggedInStaff.permission.staff.view){
            throw new AuthenticationError('User do not have right to assign view staff permission')
          }

          if(update.staff.add  && ! loggedInStaff.permission.staff.add){
            throw new AuthenticationError('User do not have right to assign add staff permission')
          }
        }





        permission = await Permission.findByIdAndUpdate(id,update, { new:true }). populate( { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' })
        return permission

      }
      else{
        throw new AuthenticationError('User do not have permission for this action')
      }

    }
  }
}

module.exports =  permissionResolver