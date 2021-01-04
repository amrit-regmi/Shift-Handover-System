import React, { useContext, useEffect, useState } from 'react'
import { Modal,Form, Button, Message, Segment, Header, Icon, Dimmer, Loader } from 'semantic-ui-react'
import { DateInputField } from '../StationReportPage/NewReportForm/FormFields'
import { operateDate, formatDate, toDate } from '../../utils/DateHelper'
import { FieldArray, Formik } from 'formik'
import { validateStartEndTime } from '../StationReportPage/NewReportForm/validator'
import _ from 'lodash'
import { ALL_STATION } from '../../queries/stationQuery'
import { GET_SHIFTREPORT_ID } from '../../queries/shiftReportQuery'
import { UPDATE_TIMESHEET } from '../../mutations/timeSheetMutation'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { DropDownField, InputField, RemarkField } from './TimeSheetEditFields'
import { useParams } from 'react-router-dom'
import { NotificationContext } from '../../contexts/NotificationContext'

const  TimeSheetEditModel = (props) => {
  const[,dispatch] = useContext(NotificationContext)
  const params= useParams()
  const self=  JSON.parse( sessionStorage.getItem('staffKey'))
  const { loading,data } = useQuery(ALL_STATION,{ skip: props.add === false  }) //Station list is required only when adding new record
  const [getShiftReport,{ loading:shiftReportLoading, data:shiftReportData }] = useLazyQuery(GET_SHIFTREPORT_ID)
  const [updateTimeSheet,{ loading: updateTimeSheetLoading }] = useMutation(UPDATE_TIMESHEET,{
    onError: (error) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{`Error, Failed to ${props.add?'Add':'Update' } timesheet record `}<br/>{error.message}</> ,type: 'ERROR' } })
      closeModel()
    }
  })

  const [stationOptions, setStationOptions] = useState([])
  const [newRemarkField,setNewRemarkField] = useState(false)


  const selfHasPermissionToAddEdit  = (station) => {
    if(self.permission.admin ||
      self.permission.timesheet.sign.map(station => station._id).includes(station && station.id) ||
      self.id === props.staffId){ // If viewing own timesheet or station is on timeshitsignpermission list or user is admin
      return true
    }

    return false
  }


  useEffect(() => {
    if(data && data.allStations){
      const stations = data.allStations
      const permittedStations =  stations.filter ( station => selfHasPermissionToAddEdit (station))
      const stationOptions = permittedStations.map((station,index) => {
        return { key:index, value: station.id, text: station.location }
      })

      setStationOptions(stationOptions)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data])


  const getShiftList= (stationId) => {
    if(data){
      const station = data.allStations.filter(station => station.id === stationId)

      if(station && station[0].shifts) {

        const shiftList = station[0].shifts.map((shift,index) => {

          return{ key:index, value: shift.name, text: shift.name }
        })

        return shiftList

      }
    }
  }

  /**returns approprite shift selection value to appropite shift based on starttime for choosen station  */
  const getRecomendedShiftOption = (startTime,stationId) => {
    if(data){
      const station = data.allStations.filter(station => station.id === stationId)
      if(station && station[0].shifts) {
        const sdt = new Date(toDate(startTime))
        const shiftName = station[0].shifts.reduce((p,c) => {
          /**Setting the shiftTime to given startTime for comparision  */
          const splitSt = c.startTime.split(':')
          const st = new Date(sdt)
          st.setHours(splitSt[0])
          st.setMinutes(splitSt[1])
          /** Diffence between given startTIme and shift startttime */
          const diff = (sdt-st)/(60*60*1000)

          /**return the lowest positive diffence if exist or highest negative differnce*/
          if((diff > p.diff && p.diff < 0) ){
            return { name: c.name ,diff: diff }
          }
          if(diff > 0 && diff< p.diff){
            return { name: c.name ,diff: diff }
          }
          return p
        },{ name:'',diff:-24 })
        return shiftName.name

      }
    }


  }

  const handleShiftChange = (startTime,shift,station) => {
    const st = new Date(toDate(startTime))
    const ISODate = new Date ( Date.UTC(st.getFullYear() , st.getMonth() , st.getDate())).toISOString()
    const vars = { date:ISODate ,shift: shift, station:station }
    getShiftReport({ variables: vars })
  }

  const submit = async (values) => {
    const vars = { ...values,break: parseInt(values.break) }
    if(shiftReportData && shiftReportData.getShiftReportByShift &&  shiftReportData.getShiftReportByShift.id){
      vars.handover = shiftReportData.getShiftReportByShift.id
    }

    if(!props.add){
      vars.id = props.id
    }

    /**If new remarks is added only update added remarks */
    if(values.remarks.length >= props.remarks.length){
      vars.remarks.splice(0,props.remarks.length)
    }
    updateTimeSheet(
      {
        variables: vars,
        update:(store,response) => {
        /** Need to update cache only if add , graphql auto updates timesheet on update */
          if(props.add){
            store.modify ({
              fields:{
                getTimeSheetByUser(existingTimeSheetRefs , { readField }){
                  const newTimeSheet = response.data.addToTimeSheet

                  if(existingTimeSheetRefs.some(ref => readField('id',ref) === newTimeSheet.id)){
                    return existingTimeSheetRefs
                  }

                  return [...existingTimeSheetRefs,newTimeSheet]

                },

                getAllTimeSheets(existingTimeSheetRefs){
                  const period = params.period
                  if(!period){
                    return existingTimeSheetRefs
                  }
                  const newTimeSheet = response.data.addToTimeSheet
                  const modify = _.cloneDeep(existingTimeSheetRefs)

                  const totHours = (((toDate(newTimeSheet.endTime) - toDate(newTimeSheet.startTime) )/ (60*1000*60)) - (newTimeSheet.break || 0)/60).toFixed(1)
                  if(!modify[period]){
                    modify[period] = {}
                  }

                  if(!modify[period][newTimeSheet.staff.name]){
                    modify[period][newTimeSheet.staff.name]= {}
                    modify[period][newTimeSheet.staff.name].station = { [newTimeSheet.station.location]:1 }
                    modify[period][newTimeSheet.staff.name].itemsPending = 1
                    modify[period][newTimeSheet.staff.name].totHours = totHours

                    return modify
                  }

                  const stations = modify[period][newTimeSheet.staff.name].station
                  modify[period][newTimeSheet.staff.name] = {
                    ...modify[period][newTimeSheet.staff.name],
                    itemsPending:modify[period][newTimeSheet.staff.name].itemsPending+1,
                    totHours: (parseFloat(modify[period][newTimeSheet.staff.name].totHours) + parseFloat(totHours)).toFixed(1),
                    station:  { ...stations,[newTimeSheet.station.location]: stations[newTimeSheet.station.location]+1 }
                  }

                  return modify

                }
              },
              broadcast: false
            })
          }
          dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{`Success, ${props.add?'Added':'Updated' } timesheet record for ${vars.startTime.split(' ')[0]}`}</> ,type: 'SUCCESS' } })
          closeModel()
        }
      })
  }

  const closeModel = () => {
    props.setOpen(false)
    setNewRemarkField(false)

  }

  const getInitValues = () => {
    const init = {
      startTime: props.startTime ,
      endTime: props.endTime ,
      break: props.break || 30,
      remarks: props.remarks || [],

    }

    if(props.add){
      init.staff = props.staffId
      init.startTime = formatDate((new Date(props.date).setHours(0)))
      init.endTime= (new Date(props.date).setHours(8)) > Date.now() ? formatDate(toDate(Date.now())) : formatDate((new Date(props.date).setHours(8)))
      init.station = ''
      init.shift = ''
      init.remarks = [{ title:'Manually Entered to TimeSheet' , date: formatDate(Date.now()), by: self.name }]

    }
    /**/
    return init
  }

  /**Function to auto generate remarks field based on user actions */
  const autoAddRemarks = (values) => {
    /**If the user is not making a new entry */
    if (!props.add) {
      const insertAt = props.remarks.length === 0 ? 0 : props.remarks.length
      let newRemarks = [...values.remarks]
      /**If start time and end time is modified from the original  */
      if((values.startTime !== props.startTime || values.endTime !== props.endTime)){
        /**Adding Filed Edited remarks to the last index of original remarks field, user entered remark should appear after this if there is any */
        if(!newRemarks[insertAt] || (newRemarks[insertAt] && newRemarks[insertAt].title!== 'Edited')){
          newRemarks.splice(insertAt,0,{ title:'Edited',date: formatDate(Date.now()),by:self.name, edit:{} })
        }

        if(values.startTime !== props.startTime){
          newRemarks[insertAt].edit.startTime = `${props.startTime} to  ${values.startTime}`
        }
        if(values.endTime !== props.endTime){
          newRemarks[insertAt].edit.endTime= `${props.endTime} to  ${values.endTime}`
        }
        values.remarks= newRemarks
      }
      /**If startTime is not modified or restored to original Value */
      if(values.startTime === props.startTime){

        if(newRemarks[insertAt] && values.remarks[insertAt].edit){
          delete newRemarks[insertAt].edit.startTime
        }
      }
      /**If startTime is not modified or restored to original Value */
      if(values.endTime === props.endTime){
        if(newRemarks[insertAt] && values.remarks[insertAt].edit){
          delete newRemarks[insertAt].edit.endTime
        }
      }
      /*If everything was restored to original value then remove the edited remarks */
      if(newRemarks[insertAt] && newRemarks[insertAt].edit && _.isEmpty(newRemarks[insertAt].edit)){
        newRemarks.splice(insertAt,1)
      }
      values.remarks= newRemarks
    }
  }

  const modalHeader = props.add? `Adding Work Time Record to Date ${formatDate (Date.parse(props.date)).split(' ')[0]}`: `Editing Work Time Record to Date ${formatDate (Date.parse(props.date)).split(' ')[0]}`
  return (
    <Modal
      closeIcon
      closeOnEscape={false}
      closeOnDimmerClick={false}
      open = {props.open}
      onClose= {() => closeModel()}
      onOpen= {() => props.setOpen (true)}
    >
      <Modal.Header>{modalHeader} </Modal.Header>
      <Modal.Content>



        {updateTimeSheetLoading &&
            <Dimmer active>
              <Loader />
            </Dimmer>
        }
        <Formik

          initialValues = {getInitValues()}
          validate = {values => {

            let errors = {}
            errors = { ...errors,...validateStartEndTime(values.startTime,values.endTime,props.date) }
            if(_.isEmpty(errors)){
              autoAddRemarks(values)
            }

            return errors


          } }

          onSubmit = {(values) =>
          {
            /**If last added remark is empty remark then remove from values
             * Retrived Remarks from database will have a title, new remark will always be at the end of array and may not have either title or text
             */
            if(values.remarks.length &&  !values.remarks[values.remarks.length-1].title  &&  !values.remarks[values.remarks.length-1].text ){

              const newRemarks = [...values.remarks]
              newRemarks.splice(values.remarks.length-1,1)
              values.remarks = newRemarks
            }
            /**If last added remark has text but no title then set title */
            if(values.remarks.length &&  ! values.remarks[values.remarks.length-1].title &&  values.remarks[values.remarks.length-1].text){
              values.remarks[values.remarks.length-1].title = 'Remark Added'
            }

            submit(values)}
          }


        >


          {({ values,handleSubmit,setFieldValue,dirty }) =>

            <Form size='large' style={{ marginBottom:'5rem' }} onSubmit = { handleSubmit} >

              <Form.Group >

                < DateInputField
                  label= 'Start Time'
                  readOnly = {!props.add && (props.status === 'APPROVED' || !selfHasPermissionToAddEdit(props.station))}
                  dateTimeFormat = 'DD-MM-YYYY HH:mm'
                  name ='startTime'
                  maxDate = {operateDate(Date.now(),30,'m','sub')}
                  minDate= {formatDate (Date.parse(props.date))}

                />


                < DateInputField
                  label = 'End Time'
                  readOnly = {!props.add && (props.status === 'APPROVED' || !selfHasPermissionToAddEdit(props.station))}
                  dateTimeFormat = 'DD-MM-YYYY HH:mm'
                  name='endTime'
                  maxDate = {
                    Date.now() < toDate(values.endTime)? formatDate(Date.now()) : operateDate(values.startTime,20,'h','add')
                  }
                  minDate= {operateDate(values.startTime,20,'m','add')}

                />

                <InputField
                  inputlabel= 'Break'
                  readOnly = {!props.add && (props.status === 'APPROVED' || !selfHasPermissionToAddEdit(props.station))}
                  label = 'Minutes '
                  labelPosition='right corner'
                  name= 'break'
                  type='number'
                  min='0'>
                </InputField>

              </Form.Group>


              {
                /** If the user is inserting new timesheet  */
                props.add &&
                <Form.Group>

                  <DropDownField
                    label =' Select Station'
                    loading= {loading}
                    name = 'station'
                    placholder= 'Select Station'
                    search
                    selection
                    options= {stationOptions}
                    onChange = {  (e,{ value }) => {
                      setFieldValue('station',value)
                      const shift = getRecomendedShiftOption(values.startTime,value)
                      setFieldValue('shift',shift)
                      handleShiftChange(values.startTime,shift,value)

                    }}
                  ></DropDownField>

                  <DropDownField
                    label =' Select Shift'

                    disabled = {!values.station}
                    name = 'shift'
                    placholder= 'Select Shift'
                    search
                    selection
                    options= {values.station? getShiftList(values.station):[]}
                    onChange = {(e,{ value } ) => {
                      setFieldValue('shift',value)
                      handleShiftChange(values.startTime,value,values.station)
                    }}
                  ></DropDownField>


                </Form.Group>
              }

              { /**While Loading Data */
                shiftReportLoading &&
                  <Segment secondary loading>
                    Verifying {values.shift} Shift
                  </Segment>
              }

              { /**If the shift is set and shift report exist for the corresponding shift */
                values.shift && shiftReportData && shiftReportData.getShiftReportByShift &&
                  <Segment clearing secondary>
                    <Header as='h3'><Icon name='check circle' color='green'></Icon> Verified</Header>
                    <Header floated='left' as='h5'>{shiftReportData.getShiftReportByShift.station.location} {values.shift} Shift {shiftReportData.getShiftReportByShift.startTime.split(' ')[0]}
                      <Header.Subheader><strong> Shift Start : </strong> {shiftReportData.getShiftReportByShift.startTime}<strong> Shift End : </strong> {shiftReportData.getShiftReportByShift.endTime} </Header.Subheader>
                    </Header>
                    <Button type='button'floated='right' onClick={() => props.openReport({ id: shiftReportData.getShiftReportByShift.id, open:true })} > View Shift Report</Button>

                  </Segment>
              }

              {
                /**If the shift is set and the shift report doesnot exist for corresponding shift */
                values.shift && shiftReportData && !shiftReportData.getShiftReportByShift &&
                <Message warning visible
                  header='Selected shift is not reported'
                  content='Adding to record to unreported shift will not be reflected on any shift reports thus cannot be verified. This may result on work time not being approved'
                />
              }

              <label ><strong>Remarks</strong></label>
              <FieldArray name='remarks'>
                {({ push,remove }) => <>

                  {values.remarks && values.remarks.length > 0 && values.remarks.map((remark,index) =>
                    <RemarkField key= {index} name={`remarks.${index}`} value={remark}></RemarkField>
                  )}

                  { /**If TImesheet is approved or user doesnot have permission , it cannot be modified */
                    props.status !== 'APPROVED' && (props.add || selfHasPermissionToAddEdit (props.station) )  &&
                    <Form.Button type='button'
                      onClick= {(e) => {
                        e.preventDefault()
                        if(newRemarkField){
                          remove(values.remarks.length-1)
                          setNewRemarkField(false)
                        } else{
                          if(values.remarks.length > 0 && values.remarks[values.remarks.length-1].title === 'Clearification Requested'){
                            push({ title:'Add Clearification',date: formatDate(Date.now()),by:self.name,text:'' })
                          } else {
                            push({ title:'',date: formatDate(Date.now()),by:self.name,text:'' })
                          }
                          setNewRemarkField(true)
                        }
                      }}>
                      {!newRemarkField && values.remarks.length > 0 && values.remarks[values.remarks.length-1].title === 'Clearification Requested' ?
                        'Add Clearification' :
                        newRemarkField?'Remove Remark':
                          'Add Remark'}
                    </Form.Button>}
                </>
                }
              </FieldArray>
              { props.status !== 'APPROVED' && dirty && selfHasPermissionToAddEdit(props.station) &&
              <Button type='submit' floated='right' positive>Save</Button>
              }
              <Button type='button' floated='right' negative onClick={() => closeModel()}>Cancel</Button>
            </Form>}
        </Formik>



      </Modal.Content>

    </Modal>


  )
}

export default TimeSheetEditModel