import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import  _  from 'lodash'
import { Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell, Loader } from 'semantic-ui-react'
import { formatDate, getWeekNumber,getMonthInt, getFilterYear } from '../../utils/DateHelper'
import TimeSheet from '../StaffPage/TimeSheet'
import { GET_ALL_TIMESHEETS } from '../../queries/timeSheetQuery'
import TimeSheetsFilter from './TimeSheetsFilter'

const TimeSheetsOverview = ({ setStaffName  }) => {
  const today = new Date()
  const params = useParams()
  const location = useLocation()
  const basePage =  location.pathname.split('/')[2]

  const [filter,setFilter] = useState({
    staff:[],
    period:'date',
    from:formatDate(new Date(today.getFullYear(), today.getMonth() -3, 1 )).split(' ')[0],
    to:formatDate(today).split(' ')[0],
    number:getWeekNumber(today),
    groupBy:'week',
    stations:[],
    filterStatus: '' })

  const variables  = { ...filter }

  if(filter.staff.length === 1){
    variables.staffId = filter.staff[0]
  }

  variables.year = getFilterYear(filter.period, filter.number)

  const { loading,data } = useQuery(GET_ALL_TIMESHEETS,{ variables: variables,skip: params.period })

  useEffect (() => {
    if(data ){
      setStaffName(data.getStaffName)
    }
  },[data, setStaffName])


  if(params.period) {
    const periodTitle = params.period.split(' ')
    let period
    let selected
    let selectedYear
    if(periodTitle[0] === 'Week'){
      period='week'
      selected = periodTitle[1]
      selectedYear = periodTitle[2]
    }
    else{
      period='month'
      selected = getMonthInt(periodTitle[0])
      selectedYear = periodTitle[1]
    }

    return <TimeSheet period= {period} selected={parseInt(selected)} selectedYear={parseInt(selectedYear) } staffId={params.staffId } setStaffName={setStaffName} timesheetOnly />
  }

  return (

    <>
      <TimeSheetsFilter setFilter= {setFilter}></TimeSheetsFilter>

      <Loader active={loading}> Loading TimeSheet Overview</Loader>

      <Table >
        <TableHeader>
          <TableRow>
            {!params.staffId && basePage.toLowerCase() !== 'mypage' &&
            <TableHeaderCell>Staff Name</TableHeaderCell>
            }
            <TableHeaderCell>Period</TableHeaderCell>
            <TableHeaderCell> Stations</TableHeaderCell>
            <TableHeaderCell> Total Hours</TableHeaderCell>
            <TableHeaderCell> Status</TableHeaderCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.getAllTimeSheets && _.map(data.getAllTimeSheets, (staffs,period) =>
            _.map(staffs,(staff,id) =>
              <TableRow key={id} positive= {staff.itemsPending?false:true} negative= {staff.itemsPending?true:false}>
                {!params.staffId   && basePage.toLowerCase() !== 'mypage' &&
                <TableCell><Link to={`/Manage/ManageTimesheets/${id}`} onClick={() => {

                }}> {staff.name}</Link></TableCell> }
                <TableCell>{period}</TableCell>
                <TableCell>{
                  _.reduce(staff.station,(p,c,key) => {
                    if(c !== 0){
                      return ( (p?p+'/':'')+key)
                    }
                    return p

                  },'')}
                </TableCell>
                <TableCell>{staff.totHours}</TableCell>
                <TableCell><Link to={`${location.pathname}/${params.staffId?'':`${id}/`}${period}`}
                  onClick={() => {

                  }}>{staff.itemsPending ?  `${staff.itemsPending}  Items Pending`: 'All Approved' } </Link></TableCell>
              </TableRow>)

          )
          }

        </TableBody>
      </Table>




    </>)





}
export default TimeSheetsOverview