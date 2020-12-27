import {  useMutation } from '@apollo/client'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Table,Button, Popup, Header, Message,  Segment,Form } from 'semantic-ui-react'
import { APPROVE_TIMESHEET, DELETE_TIMESHEET, REQUEST_CLARIFICATION } from '../../mutations/timeSheetMutation'
import TimeSheetEditModel from './TimeSheetEditModel'
import _ from 'lodash'

const TimeSheetRow = ({ timeSheet, rowSpan ,openReport ,index ,date ,staffId }) => {
  const staff = JSON.parse( sessionStorage.getItem('staffKey'))

  const params= useParams()

  const permission = staff.permission && staff.permission.timesheet

  const startTime = timeSheet.startTime
  const endTime = timeSheet.endTime
  const station = timeSheet.shiftReport && timeSheet.shiftReport.station.location
  const shift = (timeSheet.shiftReport && timeSheet.shiftReport.shift) || timeSheet.shift
  const  breakt = timeSheet.break
  const totalHours = timeSheet.total
  const ot = timeSheet.overTime
  const remarks = timeSheet.remarks || []
  const [open,setOpen] = useState(false)
  const [add,setAdd] = useState(false)
  const [deleteOpen,setDeleteOpen]=  useState(false)
  const [clarifyOpen,setClarifyOpen]=  useState(false)

  const [clarifyText,setClarifyText] = useState('')

  const [approveTimesheet,{ loading:timesheetSignLoading }] = useMutation(APPROVE_TIMESHEET)
  const [mutatedeleteTimesheet,{ loading:deleteLoading }] = useMutation(DELETE_TIMESHEET)
  const [requestClarification,{ loading:clarifyLoading }] = useMutation(REQUEST_CLARIFICATION)

  const deleteTimeSheet = () => {
    mutatedeleteTimesheet(
      { variables:{ id: timeSheet.id },
        update: (store,response) => {
          if(response.data.deleteTimeSheet && response.data.deleteTimeSheet.status === 'SUCCESS') {
            store.modify({
              fields:{
                getTimeSheetByUser({ DELETE }){
                  return DELETE
                },

                getAllTimeSheets(existingTimeSheetRefs, { readField }){
                  const period = params.period
                  if(!period){
                    return existingTimeSheetRefs
                  }

                  const modify = _.cloneDeep(existingTimeSheetRefs)


                  const totHours = modify[period][timeSheet.staff.name].totHours-totalHours
                  if (totHours === 0){
                    delete (modify[period])
                    return modify
                  }

                  const stations = modify[period][timeSheet.staff.name].station
                  modify[period][timeSheet.staff.name] = {
                    ...modify[period][timeSheet.staff.name],
                    itemsPending:modify[period][timeSheet.staff.name].itemsPending-1,
                    totHours: totHours,
                    station:  { ...stations,[timeSheet.station.location]: stations[timeSheet.station.location]-1 }

                  }

                  return modify
                }
              },

              broadcast: false

            })

          }

        }
      })

  }

  const askToclarify = () => {
    const vars = {
      id: timeSheet.id,
      clearify: clarifyText
    }

    requestClarification({ variables: vars }


    )

  }

  const updateTimeSheetApproval = () => {
    approveTimesheet({
      variables:{ id:timeSheet.id , status:timeSheet.status==='APPROVED'?'':'APPROVED' },
      update: (store,response) => {
        store.modify({
          fields: {
            getAllTimeSheets(existingTimeSheetRefs, {  readField }){
              const period = params.period
              if(!period){
                return existingTimeSheetRefs
              }

              const approved = response.data.approveTimeSheet.status
              const modify = _.cloneDeep(existingTimeSheetRefs)

              console.log('before',modify[period][timeSheet.staff.name].itemsPending)

              modify[period][timeSheet.staff.name].itemsPending = approved==='APPROVED'? modify[period][timeSheet.staff.name].itemsPending-1: (modify[period][timeSheet.staff.name].itemsPending)+1


              return modify

            }
          }
        })


      }
    })

  }

  const isWeekDay = ()  => {
    const today = new Date(date).getDay()
    if( today === 0 || today ===6){
      return false
    }
    return true
  }
  /**If the id is a valid id string, empty rows with no data will not have valid ids. */
  const isEmptyRow = timeSheet.id.toString().match(/^[0-9a-fA-F]{24}$/) ? false: true

  return (
    <Table.Row  key = {timeSheet.id} negative= {!isWeekDay()}>
      {index === 0 && <Table.Cell collapsing rowSpan={rowSpan}>{ date.split('T')[0]}</Table.Cell>}
      <Table.Cell> {station} </Table.Cell>
      <Table.Cell onClick= {(e) => {
        e.preventDefault()
        openReport({ id: timeSheet.shiftReport && timeSheet.shiftReport.id, open:true })
      }}>
        {  // eslint-disable-next-line jsx-a11y/anchor-is-valid
          timeSheet.shiftReport && timeSheet.shiftReport.id ? <a href =""> {shift} </a> : shift?`${shift} `:''
        }  </Table.Cell>
      <Table.Cell >{ startTime && startTime.split(' ')[1]}</Table.Cell>
      <Table.Cell> {endTime &&endTime.split(' ')[1]} </Table.Cell>
      <Table.Cell> {breakt} </Table.Cell>
      <Table.Cell> {totalHours?totalHours:''} </Table.Cell>
      {index === 0 &&  <Table.Cell  rowSpan={rowSpan} > {ot?ot:''} </Table.Cell>}
      <Table.Cell> {timeSheet.status === 'PENDING_APPROVAL'? 'No' : timeSheet.status === 'APPROVED'? 'Yes' : timeSheet.status  } </Table.Cell>
      <Table.Cell>
        {remarks && remarks.length>0 &&
        <>{`${remarks[remarks.length-1].title} ${remarks[remarks.length-1].date.split(' ')[0]}` }  <br/>  {remarks[remarks.length-1].text}`  <br/>
          {// eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a href='#'
              onClick = {(e ) => {
                e.preventDefault()
                setOpen(true)
              }

              }>See all</a>}

        </>
        }</Table.Cell>
      <Table.Cell  >

        <Segment loading={timesheetSignLoading || deleteLoading || clarifyLoading} disabled={timesheetSignLoading || deleteLoading || clarifyLoading} size='tiny' basic  style={{ width:'max-content', display:'inline-block' }} >


          {
            /**
               * Add Button,
               * visible only if data staff is loggedin Staff or  logged in staff has permission and no record exists for  that day
               */
            isEmptyRow  && permission && (  staff.permission.admin || permission.sign.length >0 || staff.id === staffId ) &&
              <Button icon='add' size='mini' circular onClick = {() => {
                setAdd(true)
                setOpen(true)

              }}/>

          }
          {
          /**
           * If the record exist for that day
           */
            !isEmptyRow &&
            <>
              {
                /**
                 * Edit Button,
                 * visible only
                 *    if data staff is loggedin Staff
                 *    or
                 *    logged in staff has permission to sign timesheet for that station
                 *    and
                 *    record exists for that day
                 *    and
                 *    record is not already approved
                 *
                 */
                timeSheet.status !== 'APPROVED' && ( staff.permission.admin || (permission.sign.filter(station => timeSheet.station && station._id === timeSheet.station.id ).length !== 0 )) &&
                  <Popup
                    trigger=  {<Button icon='edit' size='mini' circular onClick = {() => {
                      setAdd(false)
                      setOpen(true)
                    }}/>}
                    content='Edit Timesheet'
                    position='bottom center'
                  />}


              { /**
                   * Approve Button,
                   * visible only
                   *    if data staff is not loggedin Staff
                   *    or
                   *    logged in staff has permission to sign timesheet for that station
                   *    and
                   *    record is not already approved
                   */
                ( (staff.permission.admin || permission.sign.filter(station => timeSheet.station && station._id === timeSheet.station.id ).length !== 0)  &&  staff.id !== staffId) &&
                  <>
                    <Popup
                      trigger=  { <Button  color ={timeSheet.status === 'APPROVED'?'green':'grey'} icon='check' size='mini' circular onClick = {() => {
                        updateTimeSheetApproval()
                      }}/>}
                      content={timeSheet.status === 'APPROVED'? 'Undo Approve': 'Approve'}
                      position='bottom center'
                    />

                    {
                      /**
                      * Request Clarification button,
                      * visible only
                      *    record is not already approved
                      */

                      timeSheet.status !== 'APPROVED' &&
                      <Popup size='huge' wide='very' style={{ width:'100%' }}
                        trigger=  { <Button color='blue' icon='talk' size='mini' circular />}
                        onOpen= {() => setClarifyOpen(true)}
                        onClose= {() => setClarifyOpen(false)}
                        open = {clarifyOpen}
                        content={
                          <Form onSubmit = {() => {
                            askToclarify()
                            setClarifyOpen(false)
                          }}>
                            <Header as ='h5'>Request Clearification </Header>
                            <Form.TextArea
                              value= {clarifyText}
                              onChange= {
                                (e,{ value }) => setClarifyText(value)
                              }>

                            </Form.TextArea>
                            <Form.Button floated='right' type= 'submit' primary> Send</Form.Button>
                          </Form>
                        }
                        on='click'
                        position='bottom right'
                      />
                    }
                  </>
              }

              {
                /**
                * Delete Button,
                * visible only
                *    if data staff is  loggedin Staff
                *    or
                *    logged in staff has permission to edit timesheet for that station
                *    and
                *    record is not already approved
                */

                timeSheet.status !== 'APPROVED' &&((staff.permission.admin || permission.sign.filter(station => timeSheet.station && station._id === timeSheet.station.id ).length !== 0)   || staff.id === staffId  ) &&
                <Popup as={Message} warning
                  trigger=  { <Button  color = 'red' icon='trash' size='mini' circular />}
                  content={
                    <>

                      <Message.Header>Are you sure, you want to remove this record?</Message.Header>
                      <p> Action is non reversible and will remove all the instances of this record from the system.</p>

                      <Button fluid color='red' icon='trash' content='Confirm' onClick = {() => {
                        deleteTimeSheet(timeSheet.id)
                        setDeleteOpen(false)

                      }} /></>}
                  on='click'
                  onOpen= {() => setDeleteOpen(true)}
                  onClose= {() => setDeleteOpen(false)}
                  open={deleteOpen}
                  position='bottom center'
                />}
            </>}
        </Segment>



      </Table.Cell>
      <TimeSheetEditModel
        staffId = {staffId}
        id= {timeSheet.id}
        openReport={openReport}
        date = {date}
        open={open}
        status ={timeSheet.status}
        setOpen= {setOpen}
        startTime= {startTime}
        endTime= {endTime}
        break= {breakt}
        add= {add}
        remarks= {remarks} >
      </TimeSheetEditModel>
    </Table.Row>)

}

export default TimeSheetRow