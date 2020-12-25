import { useLazyQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { DateInput } from 'semantic-ui-calendar-react'
import { Form, FormGroup, Segment,Label } from 'semantic-ui-react'
//import { GET_ALL_STAFF_MINIMAL } from '../../../queries/staffQuery'
import { formatDate, getMonthOptions, getWeekOptions,getWeekNumber } from '../../utils/DateHelper'
import { GET_ALL_STAFF_MINIMAL } from '../../queries/staffQuery'
import { ALL_STATION } from '../../queries/stationQuery'

const TimeSheetsFilter = ({ setFilter }) => {
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

  const location = useLocation ()
  const basePage =  location.pathname.split('/')[2]


  const [filterStatus,setFilterStatus] = useState('')

  const [staffOptions,setStaffOptions] = useState([])

  const [stationOptions,setStationOptions] = useState(loggedInStaff.permission.timesheet.view.map((station,index ) => {
    return { key: index, value:station._id, text: station.location }})
  ) //Setting the permitted station list

  /**If staff has admin rights then all station should be displayed in options */
  const [getAllStations,{ loading: stationLoading, data: stationData  }] = useLazyQuery(ALL_STATION )
  useEffect(() => {
    if(stationData && stationData.allStations){
      const stOpt=  stationData.allStations.map((station,i) => {
        return { key: i, value:station.id, text: station.location }
      })
      setStationOptions(stOpt)
    }


  }, [stationData])

  const [getAllStaffs,{ loading: staffLoading, data: staffData }] = useLazyQuery(GET_ALL_STAFF_MINIMAL)

  useEffect(() => {
    if(staffData){
      const staffOpt = staffData.allStaff.map((staff,index) => {
        return { key:index, value:staff.id, text: staff.name }
      } )
      setStaffOptions(staffOpt)
    }


  }, [staffData])

  useEffect(() => {
    setFilter({ staff, period ,stations ,groupBy ,from ,to , number, year, filterStatus })
  },[staff, period, stations, groupBy, from, to, number, year, filterStatus, setFilter])

  useEffect(() => {
    if(params.staffId ){
      setStaff([params.staffId])
    }else{
      setStaff([])
    }
    if(basePage.toLowerCase() === 'mypage'){
      setStaff([loggedInStaff.id])
    }
  },[basePage, loggedInStaff.id, params])


  return (

    <>

      <Segment size='tiny' clearing>
        <Label size='mini' attached='top left'>Filters</Label>
        <Form size='mini'>
          <FormGroup widths='equal' >
            {
              !params.staffId && basePage.toLowerCase() !== 'mypage' &&
              <Form.Dropdown
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
              loading= {stationLoading}
              options={stationOptions}
              value= {stations}
              selection multiple clearable
              placeholder='All'
              onFocus= {() => {
                if(loggedInStaff.permission.admin) {
                  getAllStations()
                }
              }
              }
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
    </>)





}
export default TimeSheetsFilter