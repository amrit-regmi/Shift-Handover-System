import { useMutation, useQuery } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Form, Grid, Header, Icon, Segment, Table } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { DELETE_STATION, REMOVE_FROM_MAILINGLIST, REMOVE_SHIFTS } from '../../mutations/stationMutation'
import { GET_STATION } from '../../queries/stationQuery'
import ConfirmModal from '../ConfirmModal'
import AddMailingListModal from './AddMailingListModal'
import AddShiftsModal from './AddShiftsModal'
import ResetStationKeyModal from './ResetStationKeyModal'

const Settings = (props) => {
  const [,dispatch] = useContext(NotificationContext)
  const[confirmModalOpen, setConfirmModalOpen] = useState(false)
  const[addShiftsModalOpen,setAddShiftsModalOpen] = useState(false)
  const[addMailingListModalOpen,setAddMailingListModalOpen] = useState(false)
  const[resetStationKeyModalOpen,setResetStationKeyModalOpen] = useState(false)

  const [confirm,setConfirm] = useState({ title:'',fn:() => {} })
  const [stationData,setStationData ] = useState(props.data)
  const history = useHistory()
  let stationId = useParams().stationId

  const { data } = useQuery(GET_STATION,{
    variables:{ id:stationId },
    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, could not retrive Station'}<br/> {err.message}</> ,type: 'ERROR' } })
    } })

  useEffect(() => {
    if(data && data.getStation){
      setStationData(data.getStation)
    }
  }, [data])

  /**Delate Station Mutation */
  const [deleteStation] = useMutation(DELETE_STATION,{
    variables:{ stationId: stationId },
    update: (store) => {
      store.evict({
        id: `Station:${stationId}`
      })
    },
    onCompleted: ({ addContact }) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Station Deleted' ,type: 'SUCCESS' } })
      history.push('/Manage/AllStations')
    },
    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to delete Station'}<br/> {err.message}</> ,type: 'ERROR' } })
    }
  })

  /**Delete from mailinglist mutaiton */

  const [deleteFromMailingList] = useMutation(REMOVE_FROM_MAILINGLIST)
  const deleteFromMailingMutation = (email) => {
    deleteFromMailingList({
      variables:{ email: email, stationId: stationId },
      update:(store) => {
        store.modify({
          id: `Station:${stationId}`,
          fields:{
            mailingList(existingEmails){
              return [...existingEmails.filter(item => item !== email )]
            }
          }
        })
      }

    }).then(
      res => dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, ${email} removed from mailing list `  ,type: 'SUCCESS' } }),
      err => dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Error, coluld not remove email' ,type: 'ERROR' } })

    )
  }

  /**Delete shift mutaiton */

  const [deleteShift] = useMutation(REMOVE_SHIFTS)
  const removeShift = (id,shiftName) => {
    deleteShift({
      variables:{ id: id, stationId: stationId },
      update:(store) => {
        store.evict({
          id: `ShiftInfo:${id}`
        })
      }
    }).then(
      res => dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, ${shiftName} shift removed from station `  ,type: 'SUCCESS' } }),
      err => dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Error, coluld not remove shift' ,type: 'ERROR' } })

    )
  }

  return (
    <>
      <Grid padded>
        <Grid.Row>
          <Segment basic attached>
            <Header as ='h5'>Mailing List
              <Header.Subheader>Below emails will receive the shift reports on submit.</Header.Subheader></Header>
            <Table attached  compact collapsing padded>
              <Table.Body>
                {stationData && stationData.mailingList.map((email,i) =>
                  <Table.Row key={i}>
                    <Table.Cell>{email}</Table.Cell>
                    <Table.Cell><Icon link name='trash'
                      onClick={
                        () => {
                          setConfirmModalOpen(true)
                          setConfirm({ title:' Are you sure you want to delete this email' , fn :() => deleteFromMailingMutation(email) }) }}
                    ></Icon></Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            <Form.Button style={{ marginTop:'0.5rem' }}primary size='tiny' onClick={() => setAddMailingListModalOpen(true)}> Add More </Form.Button>
          </Segment>
          <Segment basic attached>
            <Header as ='h5'>Shifts
              <Header.Subheader>Below are the working shifts for this station. </Header.Subheader></Header>
            <Table attached  compact collapsing padded>
              <Table.Body>
                {stationData && stationData.shifts.map((shift,i) =>
                  <Table.Row key={i}>
                    <Table.Cell>{shift.name } <strong>starts at</strong> {shift.startTime}</Table.Cell>
                    <Table.Cell><Icon link name='trash'
                      onClick={
                        () => {
                          setConfirmModalOpen(true)
                          setConfirm({ title:' Are you sure you want to remove this shift' , fn :() => removeShift(shift.id, shift.name) }) }}></Icon></Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
            <Form.Button style={{ marginTop:'0.5rem' }}primary size='tiny' onClick= {() => setAddShiftsModalOpen(true)}> Add More </Form.Button>
          </Segment>
          <Segment attached>
            <Header as ='h5'>Staff signing mehtods
              <Header.Subheader>Staff can sign and report working hours using following Methods </Header.Subheader></Header>
            <p>This feature is not Implmented yet. By default, user should sign with his credentials.</p>
          </Segment>
          <Segment attached>
            <Button
              primary
              onClick={
                () => {
                  setResetStationKeyModalOpen(true)}}> Reset station key </Button>
          </Segment>

        </Grid.Row>

      </Grid>
      <Button
        negative
        onClick={
          () => {
            setConfirmModalOpen(true)
            setConfirm({ title:' Are you sure you want to delete this station' , fn :() => deleteStation() }) }}> DELETE STATION </Button>
      {confirmModalOpen &&
        <ConfirmModal open= {confirmModalOpen} confirm= {confirm} setOpen= {setConfirmModalOpen} ></ConfirmModal>
      }

      {addShiftsModalOpen &&
        <AddShiftsModal station= {stationData} open= {addShiftsModalOpen} setOpen= {setAddShiftsModalOpen}></AddShiftsModal>
      }

      {addMailingListModalOpen &&
        <AddMailingListModal station= {stationData} open= {addMailingListModalOpen} setOpen= {setAddMailingListModalOpen}></AddMailingListModal>
      }

      {resetStationKeyModalOpen &&
        <ResetStationKeyModal station= {stationData} open= {resetStationKeyModalOpen} setOpen= {setResetStationKeyModalOpen}></ResetStationKeyModal>
      }
    </>
  )


}
export default Settings