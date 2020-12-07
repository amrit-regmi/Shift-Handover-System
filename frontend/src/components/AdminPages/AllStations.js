import React, { useState,useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { ALL_STATION } from '../../queries/stationQuery'
import { Segment, Loader, Table, TableHeaderCell, TableRow, TableCell, Button, Icon, Input, Flag } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NewStationModel from './NewStationModal'


const AllStations = () => {
  const { loading,error,data } = useQuery(ALL_STATION , { variables:{ detailed:true } })
  const  [stationsData,setStationsData]  = useState([])
  const [stationAddOpen,setStationAddOpen ]= useState(false)

  useEffect  (() => {
    if(data  && data.allStations ){
      setStationsData(data.allStations)
    }
  }, [data])

  if(loading){
    return (
      <Loader active>Fetching Staffs</Loader>
    )
  }

  if(error){
    console.log(error)
    return <Segment >Something Went Wrong </Segment>
  }




  return (
    <>
      <Button primary icon onClick= {() => setStationAddOpen(true)}>Add New Station <Icon name = 'add'> </Icon></Button>
      {
        stationsData &&
      <Input icon='search'  placeholder='Country or location ...'
        onChange ={ (event,{ value }) => {
          if(!value || value.trim() === ''){
            setStationsData(data.allStations)
          }else{
            const filterData = stationsData.filter(station => station.location.toLowerCase().includes(value.toLowerCase()) ||  station.address.country.toLowerCase().includes(value.toLowerCase()))
            setStationsData(filterData)
          }
        }}
      />}
      <Table textAlign='center'>
        <Table.Header>
          <TableRow>
            <TableHeaderCell> Location </TableHeaderCell>
            <TableHeaderCell> Staff Count (Last 24 Hrs) </TableHeaderCell>
            <TableHeaderCell> Address </TableHeaderCell>
            <TableHeaderCell> Phone No. </TableHeaderCell>
            <TableHeaderCell> Email </TableHeaderCell>
          </TableRow>
        </Table.Header>
        <Table.Body>
          {stationsData && stationsData.map( station =>
            <Table.Row key= {station.id}>
              <TableCell><Link to={`/Manage/AllStations/${station.id}`}>{station.location}</Link></TableCell>
              <TableCell>{station.activeStaffs}</TableCell>
              <TableCell>{<> {station.address.street} <br/>   {station.address.postcode} {station.address.city} <br/>  {station.address.country}    <Flag name={station.address && station.address.country && station.address.country.toLowerCase()}></Flag> </>}</TableCell>
              <TableCell>{station.phone && station.phone.reduce((p,c) => <>{c}  <br/> {p}</> , '') } </TableCell>
              <TableCell>{station.email}</TableCell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      {stationAddOpen &&
        <NewStationModel open={stationAddOpen} setOpen= {setStationAddOpen}></NewStationModel>
      }

    </>

  )
}

export default AllStations