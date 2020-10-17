import React,{ Fragment, useState } from 'react'
import { Button, Table } from 'semantic-ui-react'
import { toDate } from '../../utils/DateHelper'
import _ from 'lodash'
import ReportViewModal from '../ShiftReport/ReportViewModal'
import TimeSheetRow from './TImeSheetRow'


const TimeSheetsReport = ({ startDate,endDate,data, setAllApproved })  => {
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
                <TimeSheetRow  date = {date} index = {index} key = {timeSheet.id} openReport= {setOpenReport} timeSheet={timeSheet} rowSpan={timeSheets.length} />
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