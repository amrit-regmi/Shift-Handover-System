import { toDate } from '../../utils/DateHelper'
import _ from 'lodash'


export const validateStaffsField= (value) => {
  let error
  if(!value ||  !value.length ){
    error = 'Report must have staff information'
    return error
  }
  if (value && value.length){
    error = _.mapValues(value, staff => {
      let errList = validateStaffInputField(staff)
      if (!staff.signedOffKey){
        errList = { ...errList,  'signedOffKey':'Each staff must sign off' }
      }
      return errList

    }) }
  _.mapKeys(error,(v,k) => {
    if(_.isEmpty(v)) {
      delete error[k]
    }
    console.log(k)
  })

  return error


}

export const validateStaffInputField = (staff) => {

  let error
  if(!staff) {
    return undefined
  }
  if(!staff.name ){
    error = { ...error, 'name':'Staff name is required' }
  }

  error = { ...error,...validateStartEndTime(staff.startTime,staff.endTime) }

  return error
}


export const validateStartEndTime = (startTime,endTime)  => {
  let error
  if(!startTime){
    error = { ...error, 'startTime':'Start time is required' }
  }

  if(!endTime){
    error = { ...error,  'endTime':'End time is required' }
  }

  if(!startTime.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d\d\d\d (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/)){
    error = { ...error,  'startTime':'Start time should be on format DD-MM-YYYY HH:MM' }
  }

  if(!endTime.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d\d\d\d (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/)){
    error = { ...error,  'endTime':'End time should be on format DD-MM-YYYY HH:MM' }
  }

  if( toDate(startTime) + (24 *3600 * 1000) <= Date.now()){
    error = { ...error,  'startTime':'Start time should be within last 24 hours' }
  }

  if( toDate(startTime) >= toDate(endTime)){
    error = { ...error,  'startTime':'Start time cannot be later than endtime' }
  }

  if( toDate(startTime) > Date.now()){
    error = { ...error,  'startTime':'Start time cannot be on future' }
  }

  if( toDate(endTime) > Date.now()){
    error = { ...error,  'endTime':'End time cannot be on future' }
  }

  return error

}

export const validateTasks = (tasks) => {
  if(!tasks) return null
  const error = _.mapValues(tasks,typedTasks => {
    const taskErrors = _.mapValues( typedTasks,task => {
      const taskError = validateTaskField(task)
      return taskError
    })

    return(_.pickBy(taskErrors,_.identity))



  })



  _.mapKeys(error,(v,k) => {
    if(_.isEmpty(v)) {
      delete error[k]
    }
    console.log(k)
  })

  return error
}




const validateTaskField = (task) => {
  let error = null
  if(task.status === 'OPEN') {
    if(!task.action ){
      error = { ...error, action:'Action was requested on this task. Please perform a action. ' }
    }
  }

  if(!task.description){
    error= { ...error,description:'Please add task description' }
  }
  return error


}