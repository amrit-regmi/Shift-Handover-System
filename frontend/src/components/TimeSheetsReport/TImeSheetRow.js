import React, { useState } from 'react'
import { Table,Button } from 'semantic-ui-react'
import { toDate } from '../../utils/DateHelper'
import TimeSheetEditModel from './TimeSheetEditModel'

const TimeSheetRow = ({ timeSheet, rowSpan ,openReport ,index ,date }) => {

  const [startTime,setStartTime] = useState(timeSheet.startTime)
  const [endTime,setEndTime] = useState(timeSheet.endTime)
  const [station,setStation] = useState(timeSheet.shiftReport && timeSheet.shiftReport.station.location)
  const [shift,setShift] = useState(timeSheet.shiftReport && timeSheet.shiftReport.shift)
  const [breakt,setBreakt] = useState(timeSheet.break)
  const [remarks,setRemarks] = useState(timeSheet.remarks || [])
  const [open,setOpen] = useState(false)
  const [add,setAdd] = useState(false)

  /** Calculate total hours for one shft Report */
  const calcTotal = () => {
    if(!( startTime &&endTime)) return null
    const totHours = ((toDate(endTime) - toDate(startTime) - (breakt*60*1000))/ (60*1000*60)).toFixed(1)
    return totHours
  }
  const [totalHours,setTotalHours] = useState( calcTotal())

  /** Calculate the overtime Hours for one shift report  */
  const calculateOt = () => {

    if(!(totalHours)) return null
    const reqHours =  timeSheet.staff && timeSheet.staff.reqHours
    const totHours =  calcTotal(startTime,endTime,breakt)
    const otHours =  totHours - reqHours
    return otHours
  }
  const [otHours,setOtHours] = useState(calculateOt())



  return (
    <Table.Row  key = {timeSheet.id}>
      {index === 0 && <Table.Cell collapsing rowSpan={rowSpan}>{ date.split('T')[0]}</Table.Cell>}
      <Table.Cell> {station} </Table.Cell>
      <Table.Cell selectable onClick= {() => openReport({ id: timeSheet.shiftReport && timeSheet.shiftReport.id, open:true })}
      > {shift} </Table.Cell>
      <Table.Cell >{ startTime && startTime.split(' ')[1]}</Table.Cell>
      <Table.Cell> {endTime &&endTime.split(' ')[1]} </Table.Cell>
      <Table.Cell> {breakt} </Table.Cell>
      <Table.Cell> {calcTotal()} </Table.Cell>
      <Table.Cell> {calculateOt()} </Table.Cell>
      <Table.Cell> {timeSheet.status === 'PENDING_APPROVAL'? 'No' : timeSheet.status === 'APPROVED'? 'Yes' : timeSheet.status  } </Table.Cell>
      <Table.Cell>
        {remarks && remarks.length>0 &&
        <>{`${remarks[remarks.length-1].title} ${remarks[remarks.length-1].date}` }  <br/>  {remarks[remarks.length-1].text}`  <br/>  {remarks.length>1 &&
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <a
          onClick = {
            (e) => e.preventDefault
          }>See all</a>}</>
        }</Table.Cell>
      <Table.Cell>
        {!timeSheet.id.toString().match(/^[0-9a-fA-F]{24}$/) ?
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
        openReport={openReport}
        date = {date}
        open={open}
        setOpen= {setOpen}
        startTime= {startTime}
        endTime= {endTime}
        setStartTime = {setStartTime}
        setEndTime = {setEndTime}
        breakt= {breakt}
        setBreakt= {setBreakt}
        add= {add}
        setOtHours = {setOtHours}
        setTotalHours = {setTotalHours}
        remarks= {remarks} >
      </TimeSheetEditModel>
    </Table.Row>)

}

export default TimeSheetRow