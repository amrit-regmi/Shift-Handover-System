import React,{ Fragment, useState } from 'react'
import { Button, Table } from 'semantic-ui-react'
import { toDate } from '../../utils/DateHelper'
import _ from 'lodash'
import ReportViewModal from '../ShiftReport/ReportViewModal'


const TimeSheetsReport = ({ startDate,endDate,data })  => {
  const [openReport,setOpenReport]= useState({ id:'', open: false })

  /** sets the calender from start date and end dates so the empty dates will also be displayed on report*/
  const calenderArray =[...new Array( Math.ceil((endDate - startDate)/(24*60*60*1000)) +1 )].map((n,index) => {
    const day = index
    const date = new Date ( Date.UTC(startDate.getFullYear() , startDate.getMonth() , startDate.getDate()+day)).toISOString()
    return date
  } )

  /**Converting calender array to object */
  const calenderObject = _.zipObject(calenderArray,calenderArray.map((val,index) => [{ id:index }]))

  let shiftDate
  if(data) {

    /**There is chance that the staff might be on 2 shifts on the day so grouping by date */
    shiftDate = _.groupBy(data.getTimeSheetByUser, 'date')
    shiftDate = ( { ...calenderObject,...shiftDate })

  }

  /** Calculate the overtime Hours for one shift report  */
  const calculateOt = (startTime,endTime,breakTime) => {

    if(!(endTime && startTime)) return null
    const reqHours =  data && data.getTimeSheetByUser[0].staff.reqHours
    const totHours =  calcTotal(startTime,endTime,breakTime)
    const otHours =  totHours - reqHours
    return otHours
  }

  /** Calculate total hours for one shft Report */
  const calcTotal = (startTime,endTime,breakTime) => {
    if(!(endTime && startTime)) return null
    const totHours = ((toDate(endTime) - toDate(startTime) - (breakTime*60*1000))/ (60*1000*60)).toFixed(1)
    return totHours
  }

  /** Calculate net hours and net ot hours */
  const [totalHours,totalOtHours] = data && data.getTimeSheetByUser.reduce((p,c) => {

    if(!(c.startTime && c.endTime)) return p
    const totalPerShift = calcTotal(c.startTime,c.endTime,c.break)
    const totalH = p[0]+parseFloat(totalPerShift)
    const totalOtPerShift =  totalPerShift - c.staff.reqHours
    const totalOT = p[1] + totalOtPerShift

    return [totalH,totalOT]

  },[0,0])

  const stickyTh = {
    position: 'sticky',
    top : '0'

  }

  return (
    <>
      <Table celled striped structured textAlign='center'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style= {stickyTh}> Date </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Station </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Shift </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Start Time </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> End Time </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Break (Mins) </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Total (Hrs) </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> OverTime </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Approved </Table.HeaderCell>
            <Table.HeaderCell style= {stickyTh}> Remarks </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {shiftDate && _.map(shiftDate,(timeSheets,date) =>
            <Fragment key = {date}>
              {timeSheets.map( (timeSheet,index) =>
                <Table.Row  key = {timeSheet.id}>
                  {index === 0 && <Table.Cell collapsing rowSpan={timeSheets.length}>{date.split('T')[0]}</Table.Cell>}
                  <Table.Cell> {timeSheet.shiftReport && timeSheet.shiftReport.station.location} </Table.Cell>
                  <Table.Cell selectable onClick= {() => setOpenReport({ id: timeSheet.shiftReport && timeSheet.shiftReport.id, open:true })}
                  > {timeSheet.shiftReport && timeSheet.shiftReport.shift} </Table.Cell>
                  <Table.Cell >{ timeSheet.startTime && timeSheet.startTime.split(' ')[1]}</Table.Cell>
                  <Table.Cell> {timeSheet.endTime && timeSheet.endTime.split(' ')[1]} </Table.Cell>
                  <Table.Cell> {timeSheet.break} </Table.Cell>
                  <Table.Cell> {calcTotal(timeSheet.startTime, timeSheet.endTime,timeSheet.break)} </Table.Cell>
                  <Table.Cell> {calculateOt(timeSheet.startTime, timeSheet.endTime,timeSheet.break)} </Table.Cell>
                  <Table.Cell> {timeSheet.status === 'PENDING_APPROVAL'? 'No' : timeSheet.status === 'APPROVED'? 'Yes' : timeSheet.status  } </Table.Cell>
                  <Table.Cell> {timeSheet.remarks}</Table.Cell>
                  <Table.Cell>
                    {!timeSheet.shiftReport ?
                      <Button icon='add' size='mini' circular/>
                      :
                      <Button icon='edit' size='mini' circular/>}
                  </Table.Cell>

                </Table.Row>
              )
              }</Fragment>
          )
          }

        </Table.Body>
        <Table.Footer>
          <Table.Row >
            <Table.HeaderCell  colSpan='6'>Total</Table.HeaderCell>
            <Table.HeaderCell> {totalHours} </Table.HeaderCell>
            <Table.HeaderCell> {totalOtHours} </Table.HeaderCell>
            <Table.HeaderCell colSpan='2' />
          </Table.Row>
        </Table.Footer>
      </Table>

      <ReportViewModal setOpenReport= {setOpenReport} openReport={openReport}></ReportViewModal>
    </>)
}

export default TimeSheetsReport