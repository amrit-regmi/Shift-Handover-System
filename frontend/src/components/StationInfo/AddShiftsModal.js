import { gql, useMutation } from '@apollo/client'
import React, { Fragment, useContext } from 'react'
import { forEach } from 'lodash'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { FieldArray, Formik } from 'formik'
import { InputField, TimeInputField } from '../StationReportPage/NewReportForm/FormFields'
import { NotificationContext } from '../../contexts/NotificationContext'
import { ADD_SHIFTS } from '../../mutations/stationMutation'

const AddShiftsModal = ({ open ,setOpen ,station }) => {
  const[,dispatch] = useContext(NotificationContext)
  const [addShifts] = useMutation (ADD_SHIFTS,{
    update:(store,{ data: { addShifts } }) => {
      store.modify({
        id: `Station:${station.id}`,
        fields:{
          shifts(existingShiftsRefs, { readField }) {
            let newShiftRefs =[]

            forEach(addShifts,(shift) => {
              if(!existingShiftsRefs.some(ref => readField('id',ref) === shift.id)){
                newShiftRefs.push(store.writeFragment({
                  data:shift,
                  fragment: gql`
                fragment NewShift on ShiftInfo {
                  id
                  name
                  startTime
                }
              `
                }))
              }
            })
            return [...existingShiftsRefs, ...newShiftRefs]
          }
        }
      })
    },
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, shifts added' ,type: 'SUCCESS' } })
      setOpen(false)
    },

    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to add shifts'}<br/> {err.message}</> ,type: 'ERROR' } })
      setOpen(false)
    }

  })

  return(

    <Formik
      initialValues= {{
        shifts: [{ name:'',startTime:'' }]
      }}

      validate = { (values) => {

        const errors = {}
        if(values.shifts.length){
          forEach(values.shifts, (shift,index) => {
            if(!shift.name){
              if (!errors.shifts) errors.shifts=[]
              if (!errors.shifts[index] ) errors.shifts[index] = {}
              errors.shifts[index].name = 'Please provide shift name'
            }

            if(!shift.startTime){
              if (!errors.shifts) errors.shifts=[]
              if (!errors.shifts[index] ) errors.shifts[index] = {}

              errors.shifts[index].startTime = 'Shift start time is required'
            }

            if(shift.startTime){
              if(!shift.startTime.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)){
                if (!errors.shifts) errors.shifts=[]
                if (!errors.shifts[index] ) errors.shifts[index] = {}

                errors.shifts[index].startTime = 'Shift start should be on format HH:mm'
              }
            }

          }
          )
        }

        return errors
      }
      }
      onSubmit= {(values) => {

        addShifts({ variables:{ ...values, stationId: station.id } })
      }}>

      {({ handleSubmit ,values }) =>

        <Modal
          open= {open}
          closeOnEscape= {false}
          closeOnDimmerClick={false}
        >
          <Modal.Header>Select Stations to Add</Modal.Header>
          <Modal.Content>
            <Form>
              <FieldArray  name={'shifts'}>
                {({ push,remove }) => (<>
                  { values.shifts.length > 0 && values.shifts.map((shift,index) =>
                    <Fragment key ={index}>
                      <Form.Group style={{ margin:0 }} widths='13' >
                        <InputField name={`shifts[${index}].name`} placeholder='Shift Name' />
                        <TimeInputField name={`shifts[${index}].startTime`} label placeholder='Start Time'></TimeInputField>

                        {index !== 0 &&
                     <Icon
                       link
                       name ="cancel"
                       color='red'
                       onClick={ () => remove(index)
                       }/>}
                      </Form.Group>
                    </Fragment>
                  )}
                  <Button
                    style= {{ marginTop:'1rem' }}
                    type='button'
                    circular
                    icon
                    size ='mini'
                    primary
                    onClick={ () => push ({ name:'',startTime:'' })
                    }>
                    <Icon name="plus"/>
                  </Button>
                </>)}
              </FieldArray>
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

export default AddShiftsModal