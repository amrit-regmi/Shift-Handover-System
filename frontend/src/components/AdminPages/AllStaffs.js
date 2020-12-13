import React, { useState,useEffect } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_STAFF } from '../../queries/staffQuery'
import { Segment, Loader, Table, TableHeaderCell, TableRow, TableCell, Button, Icon, Input, Form, Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NewStaffModel from './NewStaffModal'
import { formatDate } from '../../utils/DateHelper'
import { DELETE_STAFF, SET_STAFF_STATUS } from '../../mutations/staffMutation'
import ConfirmModal from '../ConfirmModal'


const AllStaffs = () => {
  const { loading,error,data } = useQuery(GET_ALL_STAFF)
  const  [staffsData,setStaffsData]  = useState([])
  const [staffAddOpen,setStaffAddOpen ]= useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirm,setConfirm] = useState({ title:'', fn:() => {} })

  const loggedInstaff = JSON.parse( sessionStorage.getItem('staffKey'))

  const [deleteStaff] = useMutation(DELETE_STAFF)
  const [toggleStaffStatus, { loading: toggleing }] = useMutation ( SET_STAFF_STATUS)


  const staffDelete = (id) => {
    deleteStaff({
      variables: { id: id } ,
      update: (store) => {
        store.evict({
          id: `Staff:${id}`
        })
      }
    })
  }

  const staffToggle = (id, toggle) => {
    toggleStaffStatus({
      variables: { id:id , disabled: !toggle },
      update: (store) => {
        store.modify({
          id: `Staff:${id}`,
          fields:{
            disabled(){
              return !toggle
            }
          }
        })
      }
    })
  }


  useEffect  (() => {
    if(data  && data.allStaff ){
      setStaffsData(data.allStaff)
      console.log(data.allStaff)
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
            <TableHeaderCell> Account Status </TableHeaderCell>
            <TableHeaderCell> </TableHeaderCell>
          </TableRow>
        </Table.Header>
        <Table.Body>
          {staffsData && staffsData.map( staff =>
            <Table.Row key= {staff.id}>
              <TableCell><Link to={`/Manage/AllStaffs/${staff.id}/Profile`}>{staff.name}</Link></TableCell>
              <TableCell>{staff.email}</TableCell>
              <TableCell>{staff.phone}</TableCell>
              <TableCell>{staff.lastActive && formatDate(staff.lastActive.activeAt) }</TableCell>
              <TableCell>{staff.lastActive && staff.lastActive.station && staff.lastActive.station.location}</TableCell>
              <TableCell>{staff.accountStatus}<Form.Field>
                <Checkbox loading={toggleing} checked={!staff.disabled } toggle label={staff.disabled ?'Disabled': 'Active'} disabled = {staff.id === loggedInstaff.id}
                  onClick ={(e,{ checked }) => {
                    staffToggle( staff.id,checked)
                  }}/>
              </Form.Field></TableCell>
              <TableCell>
                {staff.id !== loggedInstaff.id && <Button circular size ='mini' icon ='trash' negative disabled = {staff.id === loggedInstaff.id}
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setConfirm({ title:'Are you sure, you want to delete '+ staff.name +'?', fn: () => staffDelete(staff.id) })
                  }}
                ></Button>}
              </TableCell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
      <NewStaffModel open={staffAddOpen} setOpen= {setStaffAddOpen}></NewStaffModel>
      {confirmModalOpen &&
        <ConfirmModal open= {confirmModalOpen} confirm= {confirm} setOpen= {setConfirmModalOpen} ></ConfirmModal>
      }
    </>

  )
}

export default AllStaffs