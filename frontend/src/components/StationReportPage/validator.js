import React from 'react'
import { toDate } from '../../utils/DateHelper'

export const validateUserField= (value) => {
  let error
  if(!value ||  !value.length ){
    error = 'Report must have staff information'
    return error
  }
  if (value && value.length){
    console.log(value)
    error = value.map((user,index) => {
      //if (!error ) error = []

      if(!user.name ){

        return ({ 'name':'Staff name is required' })
      }

      if(!user.startTime){

        return ({ 'startTime':'Start time is required' })
      }

      if(!user.endTime){

        return ({ 'endTime':'End time is required' })
      }

      if( toDate(user.startTime) >= toDate(user.endTime)){
        return ({ 'startTime':'Start time cannot be later than endtime' })
      }

      if( toDate(user.endTime) > Date.now()){
        return ({ 'endTime':'End time cannot be on future' })
      }

      if (!user.signedOffKey){
        return ( { 'signedOffKey':'Each staff must sign off' } )
      }

    }) }

  return error

}

export default validateUserField