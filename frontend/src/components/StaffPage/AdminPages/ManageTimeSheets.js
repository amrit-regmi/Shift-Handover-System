import { useLazyQuery, useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import  _  from 'lodash'
import { DateInput } from 'semantic-ui-calendar-react'
import { Dropdown, Form, FormGroup, Header, Select ,Segment,Button, Label, Table, TableHeader, TableRow, TableHeaderCell, TableBody, TableCell } from 'semantic-ui-react'
import { GET_ALL_STAFF_MINIMAL } from '../../../queries/staffQuery'
import { GET_ALL_TIMESHEETS } from '../../../queries/timeSheetQuery'
import { formatDate, getMonthOptions, getWeekOptions,getWeekNumber,getMonthInt } from '../../../utils/DateHelper'
import TimeSheet from '../TimeSheet'
import TimeSheetsReport from '../../TimeSheetsReport'

const ManageTimeSheets = ({ setStaffName }) => {
  const loggedInStaff = JSON.parse( sessionStorage.getItem('staffKey'))
  const params = useParams()
  const today = new Date()
  const [staff,setStaff] = useState([])
  const [period,setPeriod] = useState('date')
  const [stations,setStations] = useState( [])
  const [groupBy,setGroupBy] = useState('week')
  const [from,setFrom] = useState(formatDate(new Date(today.getFullYear(), today.getMonth() -3, 1 )).split(' ')[0])
  const [to,setTo] = useState(formatDate(today).split(' ')[0])
  const [number,setNumber] = useState(getWeekNumber(today))
  const [year,setYear] = useState(today.getFullYear())

  const [filterStatus,setFilterStatus] = useState('')

  const [staffOptions,setStaffOptions] = useState([])

  const [getAllStaffs,{ loading: staffLoading, data: staffData }] = useLazyQuery(GET_ALL_STAFF_MINIMAL)

  useEffect(() => {
    if (staffData){
      const staffOpt = staffData.allStaff.map((staff,index) => {
        return { key:index, value:staff.id, text: staff.name }
      } )

      setStaffOptions(staffOpt)
    }
  },[staffData])

  useEffect(() => {
    if(params.staffId){
      setStaff([params.staffId])
    }else{
      setStaff([])
    }
  },[params])

  const variables  = {
    staff:staff,
    period:period,
    from:from,
    to:to,
    number:number,
    groupBy:groupBy,
    year:year,
    stations:stations,
    filterStatus: filterStatus
  }

  if(staff.length === 1){
    variables.staffId = staff[0]
  }

  const { loading,error,data } = useQuery(GET_ALL_TIMESHEETS,{ variables: variables,skip: params.period })


  useEffect (() => {
    if(data && data.getStaff){
      setStaffName(data.getStaff.name)
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
      console.log(selected,periodTitle[0])
    }

    return <TimeSheet period= {period} selected={parseInt(selected)} selectedYear={parseInt(selectedYear) } staffId={params.staffId} setStaffName={setStaffName} timesheetOnly />
  }


  const stationOptions = loggedInStaff.permission.timesheet.view.map((station,index ) => {
    return { key: index, value:station._id, text: station.location }})

  return (
    <>

      <Segment size='tiny' clearing>
        <Label size='mini' attached='top left'>Filters</Label>
        <Form size='mini'>
          <FormGroup widths='equal' >
            {
              !params.staffId &&<Form.Dropdown
                label='Staff'
                value= {staff}
                loading={staffLoading}
                options={staffOptions}
                selection multiple clearable
                placeholder='All'
                onFocus= {() => getAllStaffs()}
                onChange= {(e,{ value }) => setStaff(value)}></Form.Dropdown>
            }
            <Form.Dropdown label='Period'
              value= {period}
              options= {[{ key:1, value:'date', text:'Date' },{ key:2, value:'week', text:'Week' },{ key:3, value:'month', text:'Month' }, ]}
              placeholder='All' selection clearable compact
              onChange ={(e,{ value }) => {
                if(value ==='week'){
                  setNumber(getWeekNumber(today))
                }
                if(value === 'month'){
                  setNumber(today.getMonth())
                }
                setPeriod(value)
              } }></Form.Dropdown>


            {period === 'date' && <>
              <DateInput value={from}  label='From'
                dateFormat='DD-MM-YYYY'
                onChange = {(e,{ value }) => {
                  setFrom(value)
                }}></DateInput>
              <DateInput value={to} label='To' dateFormat='DD-MM-YYYY'
                onChange = {(e,{ value }) => {
                  setTo(value)
                }}></DateInput>
            </>}

            {
              (period === 'week' || period === 'month') && <>
                <Form.Dropdown
                  value={number}
                  label={`Select ${period}`}
                  options={period==='week'?getWeekOptions():getMonthOptions()}
                  selection compact
                  onChange ={(e,{ value }) => {
                    setNumber(value)
                    if( period === 'week' && value > getWeekNumber(today)) {
                      setYear(today.getFullYear -1)
                    }
                    if(period === 'month' && value > today.getMonth()) {
                      setYear(today.getFullYear -1)
                    }

                  }}></Form.Dropdown>
              </>
            }
            <Form.Dropdown label= 'Group By'
              value= {groupBy}
              options= {[{ key:1,value:'week',text:'Week' }, { key:2,value:'month',text:'Month' },]}
              onChange = {(e,{ value }) => setGroupBy(value)}
              selection
              compact>

            </Form.Dropdown >
            <Form.Dropdown
              label= 'Station'
              options={stationOptions}
              value= {stations}
              selection multiple clearable
              placeholder='All'
              onChange = {(e,{ value }) => setStations(value)}></Form.Dropdown>

            <Form.Dropdown label= 'Status'
              value= {filterStatus}
              options= {[{ key:1,value:'approved',text:'Approved' }, { key:2,value:'pending',text:'Pending' },]}
              onChange = {(e,{ value }) => setFilterStatus(value)}
              placeholder='All'
              clearable
              selection
              compact>

            </Form.Dropdown >

          </FormGroup>
        </Form>
      </Segment>

      <Table>
        <TableHeader>
          <TableRow>
            {!params.staffId &&
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
            _.map(staffs,(staff,name) =>
              <TableRow key={name} positive= {staff.itemsPending?false:true} negative= {staff.itemsPending?true:false}>
                {!params.staffId &&
                <TableCell><Link to={`/ManageTimesheets/${staff.id}`} onClick={() => {
                  setStaffName(name)
                }}> {name}</Link></TableCell> }
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
                <TableCell><Link to={`/ManageTimesheets/${staff.id}/${period}`}
                  onClick={() => {
                    setStaffName(name)
                  }}>{staff.itemsPending ?  `${staff.itemsPending}  Items Pending`: 'All Approved' } </Link></TableCell>
              </TableRow>)

          )
          }

        </TableBody>
      </Table>




    </>)





}
export default ManageTimeSheets