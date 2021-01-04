import { useQuery } from '@apollo/client'
import React ,{ useEffect, useState } from 'react'
import { Loader, Header, Segment,Dropdown, Button ,Form, Popup } from 'semantic-ui-react'

import { GET_TIMESHEETS } from '../../queries/timeSheetQuery'
import { getWeekNumber, getDatefromWeek, getMonthOptions, getWeekOptions, getMonthName, getFilterYear  } from '../../utils/DateHelper'
import TimeSheetsReport from '../TimeSheetsReport'

const TimeSheet = ({ staffId,setStaffName, period ,selected ,selectedYear ,timesheetOnly }) => {
  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  const [selectBy,setSelectBy] = useState (period || 'week')
  const today = new Date()
  const [number,setNumber] = useState (!isNaN(selected)?selected:getWeekNumber(today))

  const queryParams = { staff: staffId || staff.id , filterDuration: selectBy  , number:number, year: getFilterYear(selectBy,number) }

  const { error,loading,data } = useQuery(GET_TIMESHEETS, { variables:queryParams })

  useEffect(() => {
    if (data)
      setStaffName(data.getStaffName)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data])


  /**Get startDate of timeSheet Report */
  const filterStartDate  =  () => {
    let sdate
    const year = getFilterYear(selectBy,number)
    if(selectBy==='month'){
      sdate = new Date(year,number,1)
    } else {
      sdate  = getDatefromWeek(number,year)
    }

    sdate = new Date(Date.UTC( sdate.getFullYear(), sdate.getMonth(), sdate.getDate()))
    return (sdate)
  }

  /**Get startDate of timeSheet Report */
  const filterEndDate  =  () => {
    let ed
    const year = getFilterYear(selectBy,number)
    if(selectBy==='month'){
      ed = new Date(year,number+1,0)
    } else {
      const sd  = getDatefromWeek(number,year)
      ed = new Date(Date.UTC( sd.getFullYear(), sd.getMonth(), sd.getDate()+6))
    }
    if(ed >= today ){
      ed = new Date(Date.UTC(today.getFullYear(),today.getMonth(),today.getDate()))
    }
    return (ed )
  }

  const start = filterStartDate()
  const end = filterEndDate()

  //console.log(start,end)

  if (loading) {
    return (
      <Loader active>Fetching timesheets</Loader>
    )
  }

  if (error) {
    return (
      <Header as ='h5'>Something Went Wrong, Please try again</Header>
    )
  }

  const isAllApproved = () => {
    let approved = false
    if(data && data.getTimeSheetByUser && data.getTimeSheetByUser.length > 0){
      approved = !data.getTimeSheetByUser.some(timeSheet => timeSheet.status !== 'APPROVED')
    }

    return approved
  }

  return (
    <>
      <Segment basic style= {{ marginBottom:'20em' }} >
        <Form>
          {!timesheetOnly &&
            <><label> Select by: </label>
              <Form.Group>
                <Form.Field>
                  <Dropdown
                    selection
                    options = {[ { key:1 ,text: 'Month' , value: 'month' }, { key:2 ,text: 'Week' , value: 'week' }]}
                    onChange = {(e,{ value }) => {
                      setSelectBy(value)
                      if(value==='month') {
                        setNumber (today.getMonth())
                      }else {
                        setNumber (getWeekNumber(today))
                      }

                    }
                    }
                    value = {selectBy}/>
                </Form.Field>
                <Form.Field>
                  <Dropdown
                    compact = { selectBy === 'month'? false:true }
                    selection
                    options = { selectBy === 'month'?getMonthOptions(4):getWeekOptions(4)}
                    onChange ={(e,{ value }) => {
                      setNumber(value)
                    }}
                    value = {number}/>
                </Form.Field>
              </Form.Group>
            </> }
          <TimeSheetsReport staffId={staffId} startDate={start} endDate= {end} data={data} title = {`Timesheet ${selectBy === 'month'? getMonthName(number):  `Week ${number},` } ${getFilterYear(selectBy,number)} `}></TimeSheetsReport>


          { staffId === staff.id &&
            <Segment  basic clearing>
              <Popup
                trigger = {<span  floated='right' ><Button  floated='right' disabled ={!isAllApproved()} type='button' color='blue'> Submit to Payroll</Button></span>}
                disabled= {isAllApproved()}
                content= ' All records should be approved for submission'
              />
            </Segment>
          }



        </Form>
      </Segment>



    </>
  )
}

export default TimeSheet