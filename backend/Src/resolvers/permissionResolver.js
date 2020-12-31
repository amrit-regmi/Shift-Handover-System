const { AuthenticationError, UserInputError } = require('apollo-server')
const Permission = require('../models/Permission')
const _  = require('lodash')

const permissionResolver = {
  Mutation: {
    changePermission: async (_root,args,context) => {
      const { id,...updates }= { ...args }

      const loggedInStaff = context.currentUser


      /**If user is not logged in */
      if(!loggedInStaff){
        throw new AuthenticationError('User must logged in with appropriate permissions')
      }

      const permission = await Permission.findById(id)

      /**User cannot assign permission to himself */
      if(permission.staffId === loggedInStaff.id){
        throw new AuthenticationError('User cannot  assign permission to himself')
      }
      /**Only user with admin permession can set admin permsission*/
      if(updates.admin){
        if(loggedInStaff.permission && loggedInStaff.permission.admin){
          permission.admin = true
          await permission.save()
          return permission
        }else{
          throw new AuthenticationError('User do not have permission for this action')
        }
      }

      /**User with admin permession can change any permsission*/
      if(loggedInStaff.permission && loggedInStaff.permission.admin){
        permission.staff={ ...permission.staff,...updates.staff }
        permission.timesheet ={ ...permission.timesheet,...updates.timesheet }
        permission.station = { ...permission.station,...updates.station }
        await permission.save()
        await Permission.populate(permission, { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' })
        return permission
      }



      /**Only user with staff edit permission can modify permission
       */
      if(loggedInStaff.permission && loggedInStaff.permission.staff.edit) {
        if(!id) throw new UserInputError('Missing required Fields')
        /** check if user is trying to assign permissions that user don't have */

        /**If station permission is set*/
        if(updates.station){
          if(updates.station.edit && !_.difference(updates.station.edit,loggedInStaff.permission.station.edit).length){
            throw new AuthenticationError('User do not have right to assign edit permission for provided station')
          }
          if(updates.station.add  && ! loggedInStaff.permission.station.edit){
            throw new AuthenticationError('User do not have right to assign add station permission')
          }



          permission. station = { ...permission.station,...updates.stations }
        }

        /**If timesheet permission is set*/
        if(updates.timesheet){
          if(updates.timesheet.sign && !_.difference(updates.timesheet.edit,loggedInStaff.permission.timesheet.sign).length){
            throw new AuthenticationError('User do not have right to assign timesheet sign permission for provided station')
          }
          if(updates.timesheet.view && !_.difference(updates.timesheet.view,loggedInStaff.permission.timesheet.view).length){
            throw new AuthenticationError('User do not have right to assign timesheet view permission for provided station')
          }

          permission.timesheet ={ ...permission.timesheet,...updates.timesheet }

        }

        /**If staff permission is set*/
        if(updates.staff){
          if(updates.staff.edit  && ! loggedInStaff.permission.staff.edit){
            throw new AuthenticationError('User do not have right to assign edit staff permission')

          }

          if(updates.staff.view  && ! loggedInStaff.permission.staff.view){
            throw new AuthenticationError('User do not have right to assign view staff permission')
          }

          if(updates.staff.add  && ! loggedInStaff.permission.staff.add){
            throw new AuthenticationError('User do not have right to assign add staff permission')
          }

          permission.staff={ ...permission.staff,...updates.staff }
        }


        await permission.save()
        await Permission.populate(permission, { path: 'station.edit timesheet.edit timesheet.view timesheet.sign' ,model:'Station' ,select:'id location' })
        return permission

      }
      else{
        throw new AuthenticationError('User do not have permission for this action')
      }

    }
  }
}

module.exports =  permissionResolver