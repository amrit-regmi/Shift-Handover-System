import React, { useState } from 'react'
import { Table,Button } from 'semantic-ui-react'
import { toDate } from '../../utils/DateHelper'
import TimeSheetEditModel from './TimeSheetEditModel'

const TimeSheetRow = ({ timeSheet, rowSpan ,openReport ,index ,date ,staffId }) => {

  const startTime = timeSheet.startTime
  const endTime = timeSheet.endTime
  const station = timeSheet.station && timeSheet.station.location
  const shift = (timeSheet.shiftReport && timeSheet.shiftReport.shift) || timeSheet.shift
  const  breakt = timeSheet.break
  const totalHours = timeSheet.total
  const ot = timeSheet.overTime
  const remarks = timeSheet.remarks || []
  const [open,setOpen] = useState(false)
  const [add,setAdd] = useState(false)

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
      <Table.Cell>

        {
          isEmptyRow ?
            <Button icon='add' size='mini' circular onClick = {() => {
              setAdd(true)
              setOpen(true)

            }}/>
            :
            <Button icon='edit' size='mini' circular onClick = {() => {
              setAdd(false)
              setOpen(true)

            }}/>}
      </Table.Cell>

      <TimeSheetEditModel
        staffId = {staffId}
        id= {timeSheet.id}
        openReport={openReport}
        date = {date}
        open={open}
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