import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { ADD_AIRCRFAT } from '../../mutations/costumerMutation'
import { forEach } from 'lodash'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Formik } from 'formik'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'

const AddAircraftModal = ({ open ,setOpen ,costumer }) => {

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
          const errAircraft =[]
          forEach(values.aircrafts.split(','), aircraft => {
            if(aircraft.trim().length < 3) errAircraft.push(aircraft.toUpperCase())
          })
          if (errAircraft.length ){
            errors.aircrafts = `${errAircraft.toString()} invalid Aircraft Registration, should at least 3 characters`
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
            <Button type='submit' positive onClick= { (e) => {
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