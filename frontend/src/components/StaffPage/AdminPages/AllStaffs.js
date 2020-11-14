import React, { useState,useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_ALL_STAFF } from '../../../queries/staffQuery'
import { Segment, Dimmer, Loader, Table, TableHeaderCell, TableRow, TableCell, Button, Icon, FormButton, Input } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NewStaffModel from './NewStaffModal'


const AllStaffs = () => {
  const { loading,error,data } = useQuery(GET_ALL_STAFF)
  const  [staffsData,setStaffsData]  = useState([])
  const [staffAddOpen,setStaffAddOpen ]= useState(false)

  useEffect  (() => {
    if(data  && data.allStaff ){
      setStaffsData(data.allStaff)
    }
  }, [data])

  if(loading){
    return (
      <Loader active>Fetching Staffs</Loader>
    )
  }

  if(error){
    return <Segment >Something Went Wrong </Segment>
  }




  return (
    <>
      <Button primary icon onClick= {() => setStaffAddOpen(true)}>Add New Staff <Icon name = 'add'> </Icon></Button>
      {
        staffsData &&
      <Input icon='search' placeholder='Search...'
        onChange ={ (event,{ value }) => {
          if(!value || value.trim() === ''){
            setStaffsData(data.allStaff)
          }else{
            const filterData = staffsData.filter(staff => staff.name.includes(value) )
            setStaffsData(filterData)
          }


        }}
      />}
      <Table>
        <Table.Header>
          <TableRow>
            <TableHeaderCell> Name </TableHeaderCell>
            <TableHeaderCell> Email </TableHeaderCell>
            <TableHeaderCell> Phone </TableHeaderCell>
            <TableHeaderCell> Last Active </TableHeaderCell>
            <TableHeaderCell> Recent Station </TableHeaderCell>
          </TableRow>
        </Table.Header>
        <Table.Body>
          {staffsData && staffsData.map( staff =>
            <Table.Row key= {staff.id}>
              <TableCell><Link to={`/allStaffs/${staff.id}`}>{staff.name}</Link></TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>{staff.phone}</TableCell>
              <TableCell>{staff.lastActive}</TableCell>
              <TableCell>{staff.station}</TableCell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <NewStaffModel open={staffAddOpen} setOpen= {setStaffAddOpen}></NewStaffModel>
    </>

  )
}

export default AllStaffs