import { useQuery } from '@apollo/client'
import React ,{ useEffect, useState } from 'react'
import { Loader, Header, Segment,Dropdown, Button ,Form, Popup } from 'semantic-ui-react'

import { GET_TIMESHEETS } from '../../queries/timeSheetQuery'
import { getWeekNumber, getDatefromWeek  } from '../../utils/DateHelper'
import TimeSheetsReport from '../TimeSheetsReport'

const TimeSheet = ({ staffId,setStaffName, period ,selected ,selectedYear ,timesheetOnly }) => {
  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  const [selectBy,setSelectBy] = useState (period || 'week')
  const today = new Date()
  const [number,setNumber] = useState (selected || getWeekNumber(today))
  const [year,setYear] = useState(selectedYear || today.getFullYear())
  const queryParams = { staff: staffId || staff.id , filterDuration: selectBy  , number:number, year: year }

  const { error,loading,data } = useQuery(GET_TIMESHEETS, { variables:queryParams })

  useEffect(() => {
    if (data)
      setStaffName(data.getStaffName)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[data])

  /** Get Month name from index
  * Negative index gets month from end of array
  */
  const months = new Proxy(['January','February','March','April','May','June','July','August','September','October','November','December'], {
    get(target, prop) {
      if (!isNaN(prop)) {
        prop = parseInt(prop, 10)
        if (prop < 0) {
          prop += target.length
        }
      }
      return target[prop]
    }
  })


  /**Get startDate of timeSheet Report */
  const filterStartDate  =  () => {
    let sdate
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

  if (loading) {
    return (
      <Loader active>Fetching timesheets</Loader>
    )
  }

  if (error) {
    console.log(error)
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


  /**Retrive last four month including current month */
  const getMonthOptions = () => {
    let options = []

    const currentMonth = today.getMonth()
    options = [
      { key:1 ,text: months[currentMonth] , value: currentMonth },
      { key:2 ,text: months[currentMonth -1 ] , value: currentMonth -1 < 0 ? months.length + currentMonth -1  : currentMonth -1 },
      { key:3 ,text: months[currentMonth -2] , value: currentMonth -2 < 0 ? months.length + currentMonth -2: currentMonth -2 },
      { key:4 ,text: months[currentMonth -3] , value: currentMonth -3 < 0 ? months.length + currentMonth -3: currentMonth -3 },
    ]
    return options
  }

  /**Retrieve all weeks that falls within last four month including current month*/
  const getWeekOptions = () => {
    const currentMonth = today.getMonth()
    let dYear = today.getFullYear()
    const lastYearWeekNum = getWeekNumber( new Date(dYear-1,11,28))
    const lastRetriveable  = getWeekNumber(new Date(dYear, currentMonth -3 ,1))
    let currentWeek = getWeekNumber(today)
    let options = []

    let week = currentWeek
    while ( week !== lastRetriveable-1  ){
      const option = { key: week, text: week, value: week }
      options.push (option )
      week = week -1
      if(week === 0) {
        week = lastYearWeekNum
      }
    }
    return options

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
                    options = { selectBy === 'month'?getMonthOptions():getWeekOptions()}
                    onChange ={(e,{ value }) => {
                      setNumber(value)
                      if( selectBy === 'week' && value > getWeekNumber(today)) {
                        setYear(today.getFullYear -1)
                      }
                      if(selectBy === 'month' && value > today.getMonth()) {
                        setYear(today.getFullYear -1)
                      }

                    }}
                    value = {number}/>
                </Form.Field>
              </Form.Group>
            </> }
          <TimeSheetsReport staffId={staffId} startDate={start} endDate= {end} data={data} title = {`Timesheet ${selectBy === 'month'? months[number]:  `Week ${number},` } ${year} `}></TimeSheetsReport>


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