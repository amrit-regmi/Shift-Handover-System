import React, { useState,useEffect, useContext } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { GET_ALL_STAFF } from '../../queries/staffQuery'
import { Segment, Loader, Table, TableHeaderCell, TableRow, TableCell, Button, Icon, Input, Form, Checkbox } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import NewStaffModel from './NewStaffModal'
import { formatDate } from '../../utils/DateHelper'
import { DELETE_STAFF, SET_STAFF_STATUS } from '../../mutations/staffMutation'
import ConfirmModal from '../ConfirmModal'
import { NotificationContext } from '../../contexts/NotificationContext'


const AllStaffs = () => {
  const[,dispatch] = useContext(NotificationContext)
  const { loading,error,data } = useQuery(GET_ALL_STAFF)
  const  [staffsData,setStaffsData]  = useState([])
  const [staffAddOpen,setStaffAddOpen ]= useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirm,setConfirm] = useState({ title:'', fn:() => {} })

  const loggedInstaff = JSON.parse( sessionStorage.getItem('staffKey'))
  const [deleteStaff] = useMutation(DELETE_STAFF)
  const [toggleStaffStatus, { loading: toggleing }] = useMutation ( SET_STAFF_STATUS)


  const staffDelete = (id,name) => {
    deleteStaff({
      variables: { id: id } ,
      update: (store) => {
        store.evict({
          id: `Staff:${id}`
        })
      }
    }).then(
      res =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, staff ${name} deleted` ,type: 'SUCCESS' } }),
      err =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{`Error, Cannot delete staff ${name}`}<br/> {err.message}</> ,type: 'ERROR' } })
    )
  }

  const staffToggle = (id, name, toggle) => {
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
    }).then(
      res =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, staff ${name} set ${toggle?'active':'disabled'}` ,type: 'SUCCESS' } }),
      err =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{`Error, Cannot toggle status for  staff ${name}`}<br/> {err.message}</> ,type: 'ERROR' } })
    )
  }


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
      {(loggedInstaff.permission.staff.add || loggedInstaff.permission.admin ) ===true &&
      <Button primary icon onClick= {() => setStaffAddOpen(true)}>Add New Staff <Icon name = 'add'> </Icon></Button>}
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

                <Checkbox checked={!staff.disabled } toggle label={staff.disabled ?'Disabled': 'Active'} disabled = {staff.id === loggedInstaff.id || !(loggedInstaff.permission.staff.edit || loggedInstaff.permission.admin)}
                  onChange ={(e,{ checked }) => {
                    staffToggle( staff.id,staff.name,checked)
                  }}/>
              </Form.Field></TableCell>
              <TableCell>
                {staff.id !== loggedInstaff.id && (loggedInstaff.permission.staff.edit || loggedInstaff.permission.admin)  &&
                <Button circular size ='mini' icon ='trash' negative disabled = {staff.id === loggedInstaff.id}
                  onClick={() => {
                    setConfirmModalOpen(true)
                    setConfirm({ title:'Are you sure, you want to delete '+ staff.name +'?', fn: () => staffDelete(staff.id,staff.name) })
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