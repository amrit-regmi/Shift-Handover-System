import {  useQuery } from '@apollo/client'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Dropdown,Form } from 'semantic-ui-react'
import { ALL_STATION } from '../../queries/stationQuery'
import { getMonthOptions, getWeekNumber, getWeekOptions } from '../../utils/DateHelper'

const ShiftReportFilter = ({ setFilter }) => {
  const today = new  Date()
  const loggedInStaff = JSON.parse( sessionStorage.getItem('staffKey'))
  const loggedInStation = JSON.parse(sessionStorage.getItem('stationKey'))
  const[filterBy,setFilterBy] = useState('week')
  const[number,setNumber] = useState(getWeekNumber(today))
  const [stations,setStations] = useState(loggedInStation?[loggedInStation.id]: [])
  const [stationOptions,setStationOptions] = useState(loggedInStaff && loggedInStaff.permission.station.edit.map((station,index ) => {
    return { key: index, value:station._id, text: station.location }})
  ) //Setting the permitted station list

  /**If staff has admin rights then all station should be displayed in options */
  const { loading: stationLoading, data: stationData  } = useQuery(ALL_STATION,{ skip: !(loggedInStaff && loggedInStaff.permission.admin) })


  useEffect(() => {
    if(stationData && stationData.allStations){
      const stOpt=  stationData.allStations.map((station,i) => {
        return { key: i, value:station.id, text: station.location }
      })
      setStationOptions(stOpt)
    }
  }, [stationData])

  useEffect(() => {
    setFilter({ stations, filterBy, number })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[filterBy, number, stations])


  return(
    <Form>


      <Form.Group>
        { /**Sttion options isonly visible if staff has peemission to edit that station or is admin  */
          loggedInStaff && (loggedInStaff.permission.station.edit.length || loggedInStaff.permission.admin ) &&
          <Form.Field>
            <Dropdown
              loading= {stationLoading}
              selection
              multiple
              options = { stationOptions}
              onChange ={(e,{ value }) => {
                setStations(value)
              }}
              placeholder= 'Select Station'
              value = {stations}/>
          </Form.Field>
        }


        <Form.Field>
          <Dropdown
            selection
            options = {[ { key:1 ,text: 'Month' , value: 'month' }, { key:2 ,text: 'Week' , value: 'week' }]}
            onChange = {(e,{ value }) => {
              setFilterBy(value)
              if(value==='month') {
                setNumber (today.getMonth())
              }else {
                setNumber (getWeekNumber(today))
              }

            }
            }
            value = {filterBy}/>
        </Form.Field>
        <Form.Field>
          <Dropdown
            compact = { filterBy === 'month'? false:true }
            selection
            options = { filterBy === 'month'?getMonthOptions(4):getWeekOptions(4)}
            onChange ={(e,{ value }) => {
              setNumber(value)
            }}
            value = {number}/>
        </Form.Field>
      </Form.Group>
    </Form>

  )


}
export default ShiftReportFilter