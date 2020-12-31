import { gql, useLazyQuery, useMutation } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { ADD_AIRCRFAT } from '../../mutations/costumerMutation'
import { forEach } from 'lodash'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Formik } from 'formik'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { NotificationContext } from '../../contexts/NotificationContext'
import { VERIFY_REGISTRATION } from '../../queries/costumerQuey'

const AddAircraftModal = ({ open ,setOpen ,costumer }) => {
  const [,dispatch] = useContext(NotificationContext)
  const [checkAircraftRegistration,{ loading,data }] = useLazyQuery(VERIFY_REGISTRATION)
  const [duplicateError,setDuplicateError] = useState([])
  useEffect(() => {
    if(data){
      setDuplicateError(data.verifyAircraftRegistration)
    }
  }, [data])

  const [addAircrafts] = useMutation (ADD_AIRCRFAT,{
    update:(store,{ data: { addAircrafts } }) => {

      store.modify({
        id: `Costumer:${costumer.id}`,
        fields:{
          aircrafts(existingAircraftRefs, { readField }) {

            let newAircraftRefs =[]

            forEach(addAircrafts,( aircrafts,i) => {
              if(existingAircraftRefs.some(ref => readField('id',ref) !== aircrafts.id)){
                newAircraftRefs.push(store.writeFragment({
                  data: addAircrafts[i],
                  fragment: gql`
                fragment NewAircraft on Aircraft {
                  id
                  registration
                }
              `
                }))
              }
            })
            return [...existingAircraftRefs, ...newAircraftRefs]
          }
        }
      })
    },
    onCompleted: ({ addAircrafts }) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, aircrafts ${addAircrafts.reduce((p,c) => p+c.registration+ ', ','')}  added` ,type: 'SUCCESS' } })
      setOpen(false)
    },

    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to add aircrafts'}<br/> {err.message}</> ,type: 'ERROR' } })
      setOpen(false)
    }
  })


  return(

    <Formik
      initialValues= {{
        aircrafts: []
      }}

      validate = { (values) => {

        const errors = {}
        if( values.aircrafts.length ){
          if(!values.aircrafts.match(/^[a-zA-Z, ]+$/)){
            errors.aircrafts = 'Invalid character detected, check again'
          }

          const errAircraft =[]
          forEach(values.aircrafts.split(','), aircraft => {
            if(aircraft.trim().length < 3) errAircraft.push(aircraft.trim().toUpperCase())
          })
          if (errAircraft.length ){
            errors.aircrafts = `${errAircraft.toString()} invalid Aircraft Registration, should at least 3 characters`
          }

          /**If no any error then check if the registration is unique */
          if(!errors.aircrafts){
            checkAircraftRegistration({ variables:{ registrations: values.aircrafts } })
            if(duplicateError.length){
              errors.aircrafts = `Registration ${duplicateError.toString()} already exists.`
            }
          }

        }else{
          errors.aircrafts = 'Enter at least one Aircraft'
        }

        return errors
      }
      }
      onSubmit= {(values) => {
        const aircrafts = values.aircrafts.toUpperCase().split(',')
        addAircrafts({ variables:{  registration: aircrafts, costumer: costumer.id } })
      }}>

      {({ handleSubmit }) =>

        <Modal
          open= {open}
          closeOnEscape= {false}
          closeOnDimmerClick={false}
        >
          <Modal.Header>Select Stations to Add</Modal.Header>
          <Modal.Content>
            <Form>
              <InputField name='aircrafts' label='Aircrafts' type='text' width='8' placeholder='Aircrfat Registrations separeted by comma ","'/>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button type='submit' loading={loading} disabled={loading} positive onClick= { (e) => {
              e.preventDefault()
              handleSubmit()
            }
            }> Add </Button>
            <Button type='button' negative onClick = {() => setOpen(false)}> Cancel </Button>
          </Modal.Actions>
        </Modal>}

    </Formik>




  )


}

export default AddAircraftModal