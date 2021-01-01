import React,{ Fragment, useState } from 'react'
import { Header, Table } from 'semantic-ui-react'
import { toDate } from '../../utils/DateHelper'
import _ from 'lodash'
import ReportViewModal from '../ShiftReport/ReportViewModal'
import TimeSheetRow from './TImeSheetRow'


const TimeSheetsReport = ({ startDate,endDate,data, staffId, title })  => {
  const [openReport,setOpenReport]= useState({ id:'', open: false })

  /** sets the calender from start date and end dates so the empty dates will also be displayed on report*/
  const calenderArray =[...new Array( Math.ceil((endDate - startDate)/(24*60*60*1000)) +1 )].map((n,index) => {
    const day = index
    const date = new Date ( Date.UTC(startDate.getFullYear() , startDate.getMonth() , startDate.getDate()+day)).toISOString()
    return date
  } )

  /**Converting calender array to object */
  const calenderObject = _.zipObject(calenderArray,calenderArray.map((val,index) => [{ id:index }]))
  let netTotal =0
  let netOt = 0

  let shiftDate
  if(data) {

    /**There is chance that the staff might be on 2 shifts on the day so grouping by date */
    shiftDate = _.groupBy(data.getTimeSheetByUser, 'date')

    const formatData = shiftDate && _.mapValues(shiftDate,(timeSheets,date) => {
      let totalDaily = 0
      let ot = 0
      timeSheets = timeSheets.map((timesheet,index) => {
        const breakt = (timesheet.break*60*1000)
        const total =  ((toDate(timesheet.endTime) - toDate(timesheet.startTime) - breakt)/ (60*1000*60)).toFixed(1)

        timesheet = { ...timesheet,total:parseFloat(total) }

        totalDaily = totalDaily + parseFloat(total)

        /**Overtime rules can be imlemented here
         * For now for simplicity for Employee sundays is 100% saturday is 50%  and 8 hrs(specified by contractType) + is overtime, for contractor 10hrs + is overtime
         */

        /**If staff is a employee
        const today = new Date(toDate(timesheet.startTime)).getDay()
        if( timesheet.staff.contractType === 'Employee') {
          /**If sunday */
        /*if(today === 0 ){
            ot = (totalDaily+parseFloat(total) - timesheet.staff.reqHours).toFixed(1)
          }
          /**If saturday */
        /* else if(today === 6 ){
            ot = (totalDaily + 0.5 * parseFloat(total) - timesheet.staff.reqHours).toFixed(1)
          }
          else{
            ot = (totalDaily - timesheet.staff.reqHours).toFixed(1)
          }
        }
        else{
          ot =  (totalDaily - timesheet.staff.reqHours).toFixed(1)
        }*/
        ot =  (totalDaily - timesheet.staff.reqHours).toFixed(1)
        return timesheet
      })
      timeSheets[0] = { ...timeSheets[0],overTime:ot }
      netOt = netOt + parseFloat(ot)
      netTotal = netTotal + totalDaily
      return timeSheets
    } )

    shiftDate = ( { ...calenderObject,...formatData })

  }

  const stickyTh = {
    position: 'sticky',
    top : '0',
    zIndex: 1


  }

  return (
    <>
      {title &&
     <Header as = 'h5' floated='right'>{title}</Header>
      }
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
            <Table.HeaderCell style= {stickyTh}> Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {shiftDate && _.map(shiftDate,(timeSheets,date) =>
            <Fragment key = {date}>
              {timeSheets.map( (timeSheet,index) =>
                <TimeSheetRow  staffId= {staffId} date = {date} index = {index} key = {timeSheet.id} openReport= {setOpenReport} timeSheet={timeSheet} rowSpan={timeSheets.length} />
              )
              }</Fragment>
          )
          }

        </Table.Body>
        <Table.Footer>
          <Table.Row >
            <Table.HeaderCell  colSpan='6'>Total</Table.HeaderCell>
            <Table.HeaderCell> {netTotal.toFixed(1)} </Table.HeaderCell>
            <Table.HeaderCell> {netOt.toFixed(1)} </Table.HeaderCell>
            <Table.HeaderCell colSpan='3' />
          </Table.Row>
        </Table.Footer>
      </Table>

      <ReportViewModal setOpenReport= {setOpenReport} openReport={openReport}></ReportViewModal>
    </>)
}

export default TimeSheetsReport