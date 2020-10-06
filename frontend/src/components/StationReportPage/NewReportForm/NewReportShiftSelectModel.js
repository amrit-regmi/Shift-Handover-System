import React, { useState, useEffect, useContext } from 'react'
import { Modal,Header, Button ,Icon, Checkbox, Loader,Radio ,Form } from 'semantic-ui-react'
import { useQuery } from '@apollo/client'
import { GET_SHIFT_REPORT } from '../../../queries/shiftReportQuery'
import Context from '../Context'

const NewReportShiftSelectModel = ({ stationId  }) => {
  //const client = useApolloClient()
  const [shiftActiveAlert, setShiftActiveAlertOpen ] = useState(false)
  const [selectShift, setSelectShiftOpen ] = useState(false)
  const [overrideShiftAlert, setOverrideShiftAlertOpen] = useState(false)
  //const [shiftList,setShiftList] = useState({})
  const [radioButton, setRadioButton] = useState()
  const { state } = useContext(Context)


  const { loading, error, data } = useQuery(GET_SHIFT_REPORT,{ variables:{
    station: stationId,
    flag:'ON_PROGRESS'
  } })

  useEffect(() => {
    if(data && data.getShiftReport){
      setShiftActiveAlertOpen(true)
    } else {
      setSelectShiftOpen(true)
    }
  }, [data])


  if (loading) {
    return (
      <Loader active>Initiatilizing reporting</Loader>
    )
  }

  if (error) return `Error! ${error}`

  /**
 * cancel button action
 */
  const cancelBtn = () => {
    setShiftActiveAlertOpen(false)
    setSelectShiftOpen(false)
    setOverrideShiftAlertOpen(false)
  }

  const startReport = (importFromExitingShift) => {
    if( importFromExitingShift ) {

      /**setInitialReport*/
    }
    console.log(importFromExitingShift)

  }

  return (
    <>
      { /**
       * Model if there is instance of  shift active for the station
       */
        data.getShiftReport !== null &&
        <Modal
          onClose={() => setShiftActiveAlertOpen(false)}
          onOpen={() => setShiftActiveAlertOpen(true)}
          open= {shiftActiveAlert}
        >
          <Modal.Header>Start Reporting</Modal.Header>
          <Modal.Content>
            <Header as="h5"> {data.getShiftReport.shift} shift is already in progress, do you want join this reporting?</Header>
          </Modal.Content>
          <Modal.Actions>
            <Button
              onClick = { () => {
                startReport(true)
                setShiftActiveAlertOpen(false)
              }} positive> Yes, Join  Shift Reporting
            </Button>
            <Button primary
              onClick={() => {
                setSelectShiftOpen(true)
                setShiftActiveAlertOpen(false)
              }}> No, Start New Reporting <Icon name='right chevron' />
            </Button>
            <Button negative onClick={cancelBtn}>Cancel </Button>
          </Modal.Actions>
        </Modal>
      }
      {/**
       * Model if the user choses to create new shift anyway
       */}
      <Modal
        onClose={() => setSelectShiftOpen(false)}
        onOpen={() => setSelectShiftOpen(true)}
        open= {selectShift}>
        <Modal.Header>Select Shift</Modal.Header>
        <Modal.Content>
          {state.station.shift && state.station.shift.map(shift =>  <Form.Field>
            <Radio
              key = {shift.name}
              label= {`${shift.name} Start time: ${shift.startTime}  `}
              value={shift.name}
              checked={ shift.name === radioButton}
              onChange={(event ,{ value }) => {
                setRadioButton(value)
              }}>
            </Radio>
          </Form.Field>)}
          { data.getShiftReport !== null && radioButton === data.getShiftReport.shift &&
          <Header as="h5"> {data.getShiftReport.shift} is already in progress, are you sure you want to start new report?</Header> }
        </Modal.Content>
        <Modal.Actions>
          <Button positive
            onClick = {() => {
              if(radioButton === data.getShiftReport.shift){
                setOverrideShiftAlertOpen(true) }
              else startReport(false)
              setSelectShiftOpen(false)
            }}> start Report
          </Button>
          <Button primary
            onClick={() => {
              setShiftActiveAlertOpen(true)
              setSelectShiftOpen(false)
            }}> <Icon name='left chevron' /> Back  </Button>
          <Button negative onClick = {cancelBtn  }> Cancel </Button>
        </Modal.Actions>
      </Modal>
      {
        /**
         * Model if user choses to start a new shift while the same shift is active on the station
         */
        radioButton === data.getShiftReport.shift &&

      <Modal
        onClose={() => setOverrideShiftAlertOpen(false)}
        onOpen={() => setOverrideShiftAlertOpen(true)}
        open= {overrideShiftAlert}>
        { data.getShiftReport !== null &&
        <Modal.Header> {data.getShiftReport.shift} is already in progress</Modal.Header> }
        <Modal.Content>
          <Header as="h5">Import data from existing  shift?</Header>
          <Form.Field><Checkbox label='Remove existing shift'></Checkbox> </Form.Field>
        </Modal.Content>
        <Modal.Actions>
          <Button primary onClick={() => {
            setSelectShiftOpen(true)
            setOverrideShiftAlertOpen(false)
          }}> <Icon name='left chevron' /> Back
          </Button>
          <Button onClick = {() => {
            setOverrideShiftAlertOpen(false)
            startReport(true)
          } }positive >Yes, Import</Button>
          <Button  onClick = {() => {
            setOverrideShiftAlertOpen(false)
            startReport(false)
          } }negative >No, Create New</Button>
          <Button negative  onClick = {cancelBtn  }>Cancel </Button>
        </Modal.Actions>

      </Modal> }
    </>

  )


}

export default NewReportShiftSelectModel