import { useMutation, useQuery } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Confirm, Grid,Header,Icon,Loader, Table, TableBody } from 'semantic-ui-react'
import { GET_STAFF } from '../../queries/staffQuery'
import PermissionManager from './PermissionManager'
import StaffEditModel from './StaffEditModel'
import {  RESET_PASSWORD_REQ, RESET_REGISTER_CODE } from '../../mutations/staffMutation'
import PasswordChangeModel from './PasswordChangeModel'
import { useParams } from 'react-router-dom'
import { formatDate } from '../../utils/DateHelper'
import { NotificationContext } from '../../contexts/NotificationContext'


const Profile = (props) => {
  const[,dispatch]= useContext(NotificationContext)
  const params = useParams()

  const [confirm,setConfirm] = useState({ open:false, handleCancel:() => {}, handleConfirm:() => {} })

  const [passwordChangeOpen,setPasswordChangeOpen] = useState(false)
  const staff =  JSON.parse(sessionStorage.getItem('staffKey'))

  /**Staff can edit if staff has edit or admin  permission and not own profile */
  let staffId = staff.id

  if(props.id){
    staffId= props.id
  } else if(params.staffId) {
    staffId= params.staffId
  }else {
    staffId= staff.id
  }


  const { loading,error,data } = useQuery(GET_STAFF,{ variables:{ id:staffId ,withPermission: props.staffCanEdit || false  } })



  const [resetPassword,{ loading: rpLoading,error:rpError }] = useMutation(RESET_PASSWORD_REQ,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, password reset code sent to users email' ,type: 'SUCCESS' } })
    },

    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to reset'}<br/> {err.message}</> ,type: 'ERROR' } })
    }
  })
  const [resetRegisterCode,{ loading: rcLoading,error:rcError }] = useMutation(RESET_REGISTER_CODE,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, new register code sent to users email' ,type: 'SUCCESS' } })
    },

    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to send new register code'}<br/> {err.message}</> ,type: 'ERROR' } })
    }
  })


  const resetConfirm = () => {
    setConfirm(({ open:false, handleCancel:() => {}, handleConfirm:() => {}  }))
  }

  useEffect(() => {
    if(data && props.setStaffName)
      props.setStaffName(data.getStaff.name)

  },[data, props])

  if ( rpError || rcError) {
    console.log( rpError, rcError)
  }


  if (loading) {
    return (
      <Loader active>Fetching User Profile</Loader>
    )
  }

  if (error) {
    console.log(error)
    return (
      <Header as ='h5'>Something Went Wrong, Please try again</Header>
    )
  }

  /**If the user has completed registration
   * Registered user should have regiserCode empty
  */

  const registered =  data && data.getStaff.registerCode ? false: true

  return (<>

    <Grid columns='3' style={{ marginTop:'1rem' }}>
      <Grid.Row centered  textAlign='center'>
        <Grid.Column>
          <Header as ='h4'>Basic Info</Header>
          <Table compact>
            <TableBody>
              <Table.Row>
                <Table.Cell width='8'> <strong> Id Card Saved </strong> </Table.Cell>
                <Table.Cell width='7'>{data.getStaff.idCardCode ?
                  <Icon name='checkmark' color='green'></Icon> : <Icon name='cancel' color='red'></Icon> }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell width='8'> <strong> Registration Complete</strong> </Table.Cell>
                <Table.Cell width='7'>{registered ?
                  <Icon name='checkmark' color='green'></Icon> : <Icon name='cancel' color='red'></Icon> }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Email </strong> </Table.Cell>
                <Table.Cell > {data.getStaff.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Phone </strong> </Table.Cell>
                <Table.Cell > {data.getStaff.phone}</Table.Cell>
              </Table.Row>
              { registered &&
              <Table.Row>
                <Table.Cell> <strong> Username </strong> </Table.Cell>
                <Table.Cell> {data.getStaff.username}</Table.Cell>
              </Table.Row>}
            </TableBody>
            <Table.Footer>
              {(props.staffCanEdit || staff.id === data.getStaff.id) &&
              <Table.Row>
                <Table.HeaderCell >
                  <Button
                    primary
                    size='small'
                  >
                 Scan Id Card
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell >
                  <Button
                    loading = {rpLoading || rcLoading}
                    disabled =  {rpLoading || rcLoading}
                    primary
                    size='small'
                    onClick = { (e,{ children }) => {

                      switch( children ){
                      case 'Change Password':
                        setPasswordChangeOpen(true)
                        break
                      case 'Reset Password':
                        setConfirm({
                          open:true,
                          handleConfirm: () => {
                            resetPassword({ variables:{ id:data.getStaff.id } })
                            resetConfirm()
                          },
                          handleCancel:() => {
                            resetConfirm()
                          },
                          content: 'Confirm Reset Password',
                          header:'Confirm'
                        })
                        break
                      case 'Resend Register Link':
                        setConfirm({
                          open:true,
                          handleConfirm: () => {
                            resetRegisterCode({ variables:{ id:data.getStaff.id } })
                            resetConfirm()
                          },
                          handleCancel:() => {
                            resetConfirm()
                          },
                          content: 'Confirm Reset Registration Link',
                          header:'Confirm'
                        })
                        break
                      default:
                        break
                      }
                    }

                    }
                  >
                    {registered
                      ?staff.id === data.getStaff.id
                        ? 'Change Password'
                        : props.staffCanEdit?  'Reset Password':''
                      :'Resend Register Link'}
                  </Button>
                </Table.HeaderCell>
              </Table.Row>}
            </Table.Footer>

          </Table>
        </Grid.Column>
        <Grid.Column>
          <Header as ='h4'>Contract</Header>
          <Table compact>
            <TableBody>
              <Table.Row>
                <Table.Cell> <strong> Type </strong> </Table.Cell>
                <Table.Cell>{data && data.getStaff.contractType }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Required Hrs/Day </strong> </Table.Cell>
                <Table.Cell > {data && data.getStaff.reqHours}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Position </strong> </Table.Cell>
                <Table.Cell> {data && data.getStaff.position}</Table.Cell>
              </Table.Row>
            </TableBody>


          </Table>
        </Grid.Column>
        <Grid.Column>
          <Header as ='h4'>Last Active</Header>
          <Table compact>
            <TableBody>
              <Table.Row>
                <Table.Cell> <strong> Station </strong> </Table.Cell>
                <Table.Cell>{ data && data.getStaff.lastActive &&  data.getStaff.lastActive.station && data.getStaff.lastActive.station.location }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Active at </strong> </Table.Cell>
                <Table.Cell > {data && data.getStaff.lastActive && formatDate(data.getStaff.lastActive.activeAt) }</Table.Cell>
              </Table.Row>
            </TableBody>

          </Table>
        </Grid.Column>

      </Grid.Row>
      {props.staffCanEdit &&
      <Grid.Row > <Grid.Column><PermissionManager permissions= {data.getStaff.permission}></PermissionManager> </Grid.Column>  </Grid.Row>}

      <StaffEditModel
        open={props.editModelOpen}
        setOpen= {props.setEditModelOpen}
        email = {data.getStaff.email}
        phone =  {data.getStaff.phone}
        contractType ={data.getStaff.contractType}
        reqHours =  {data.getStaff.reqHours}
        position = {data.getStaff.position}
        id= {data.getStaff.id}
      ></StaffEditModel>

      <PasswordChangeModel
        open = {passwordChangeOpen}
        setOpen = {setPasswordChangeOpen}
        id= {data.getStaff.id }
      ></PasswordChangeModel>


      <Confirm
        open={confirm.open}
        content = {confirm.content}
        header = {confirm.header}
        onCancel={confirm.handleCancel}
        onConfirm={confirm.handleConfirm}
      />

    </Grid>
  </>




  )
}





export default Profile