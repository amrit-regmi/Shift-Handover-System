import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useContext } from 'react'
import { Button, Dimmer, Form, Grid, Loader, Modal,ModalContent, ModalHeader } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { CHANGE_STATION_KEY } from '../../mutations/stationMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
const ResetStationKeyModal = (props) => {

  const [,dispatch] = useContext(NotificationContext)
  const [changekey,{ loading }] = useMutation(CHANGE_STATION_KEY,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, key reset ' ,type: 'SUCCESS' } })
      props.setOpen(false)
    },

    onError: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to change key'}<br/> {err.message}</> ,type: 'ERROR' } })
      props.setOpen(false)
    }
  })


  const initVal = {
    newKey:'',
    confirmKey:''
  }

  return(
    <Modal
      closeIcon
      closeOnEscape={false}
      closeOnDimmerClick={false}
      open = {props.open}
      onClose= {() =>  props.setOpen(false)}
      onOpen= {() => props.setOpen (true)}
    >
      <ModalHeader>StationKey Reset</ModalHeader>
      <ModalContent>

        {loading &&
            <Dimmer active>
              Updating key
              <Loader />
            </Dimmer>
        }

        <Formik
          initialValues = { initVal }
          validate= {(values) =>
          {
            const errors = {}


            if(!values.newKey ){
              errors.newKey = 'New key cannot be empty'
            }

            if(values.newKey !== values.confirmKey){
              errors.confirmKey = 'New key and confirm key must match'
            }

            return errors
          }

          }
          onSubmit= {(values) => {

            console.log('Calles')
            changekey({ variables:{ stationId:props.station.id, stationKey: values.newKey } })

          }}
        >
          {({ handleSubmit,dirty ,errors }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>
            <Grid>
              <Grid.Row>
                <InputField name='newKey' label='New key' type='password'/>
              </Grid.Row>
              <Grid.Row>
                <InputField  name='confirmKey' label='Confirm key' type='password'/>
              </Grid.Row>
            </Grid>
            {dirty && _.isEmpty(errors) &&
            <Button type='submit' style={{ marginTop: '1rem' }} positive>Change key</Button>}

          </Form>
          }
        </Formik></ModalContent>
    </Modal>

  )
}

export default ResetStationKeyModal