import { toDate } from '../../../utils/DateHelper'
import _ from 'lodash'


export const validateStaffsField= (value) => {
  let error
  /**
   * If np staff is set
   */
  if(!value ||  !value.length ){
    error = 'Report must have staff information, please add staff'
    return error
  }
  /**
   * If at least one staff is set
   */
  if (value && value.length){
    error = _.mapValues(value, staff => {
      let errList = validateStaffInputField(staff)
      /**
       * If the staff input fields have error other than signedOffkey
       */
      if(!_.isEmpty(errList)){
        errList = { ...errList,  'signedOffKey':'Please fix staff inputs' }
        return errList
      }

      /**
       * If staff is not sogned off
       */
      if (!staff.signedOffKey){
        errList = { ...errList,  'signedOffKey':'Each staff must sign off' }
      }


      return errList

    }) }

  /**
     * Removing the empty key value pairs from error
     */
  _.mapKeys(error,(v,k) => {
    if(_.isEmpty(v)) {
      delete error[k]
    }
  })

  return error


}

export const validateStaffInputField = (staff) => {

  let error
  if(!staff) {
    return undefined
  }
  /**
   * If staff name is not set
   */
  if(!staff.name ){
    error = { ...error, 'name':'Staff name is required' }
  }
  /**
   * Validating starttime and endtime
   * */
  error = { ...error,...validateStartEndTime(staff.startTime,staff.endTime) }

  return error
}


export const validateStartEndTime = (startTime,endTime)  => {
  let error
  /**
   * If start time is not set
   */
  if(!startTime){
    error = { ...error, 'startTime':'Start time is required' }
  }
  /**
   * If end time is not set
   */
  if(!endTime){
    error = { ...error,  'endTime':'End time is required' }
  }

  /**
   * Id starttime is not correct format DD-MM-YYY HH:MM
   */
  if(!startTime.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d\d\d\d (0|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/)){
    error = { ...error,  'startTime':'Start time should be on format DD-MM-YYYY HH:MM' }
  }

  /**
   * Id starttime is not correct format DD-MM-YYY HH:MM
   */
  if(!endTime.match(/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d\d\d\d (00|[0-9]|1[0-9]|2[0-3]):([0-9]|[0-5][0-9])$/)){
    error = { ...error,  'endTime':'End time should be on format DD-MM-YYYY HH:MM' }
  }

  /**
   * If starttime is earlier than 24H
   */
  if( toDate(startTime) + (24 *3600 * 1000) <= Date.now()){
    error = { ...error,  'startTime':'Start time should be within last 24 hours' }
  }

  /**
   * If starttime isgreater than end time
   */
  if( toDate(startTime) >= toDate(endTime)){
    error = { ...error,  'startTime':'Start time cannot be later than endtime' }
  }

  /**
   * If starttime is set to end time
   */

  if( toDate(startTime) > Date.now()){
    error = { ...error,  'startTime':'Start time cannot be on future' }
  }
  /**
   * If endtime is set in future
   */

  if( toDate(endTime) > Date.now()){
    error = { ...error,  'endTime':'End time cannot be on future' }
  }

  return error

}

export const validateTasks = (tasks) => {
  if(!tasks) return null
  const error = _.mapValues(tasks,typedTasks => {
    const taskErrors = _.mapValues( typedTasks,task => {
      /**
       * Validating individual tasks
       */
      const taskError = validateTaskField(task)
      return taskError
    })

    /**
     * Removing empty nested objects
     */
    return(_.pickBy(taskErrors,_.identity))



  })


  /**
   * Removing empty key value pair
   */
  _.mapKeys(error,(v,k) => {
    if(_.isEmpty(v)) {
      delete error[k]
    }
    //console.log(k)
  })

  return error
}




const validateTaskField = (task) => {
  let error = null
  /**
   * Id task status is open
   */
  if(task.status === 'OPEN') {
    /**
     * Ir there is no action on open task
     */
    if(!task.action ){
      error = { ...error, action:'Action was requested on this task. Please perform a action. ' }
    }
  }

  /**
   * If task description is empty or spaces
   */
  if((!task.description || task.description.trim() === '')){
    error= { ...error,description:'Please add task description' }
  }
  return error


}