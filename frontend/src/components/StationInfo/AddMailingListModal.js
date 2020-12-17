import { useMutation } from '@apollo/client'
import React, { useContext, useState } from 'react'

import { forEach } from 'lodash'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Formik } from 'formik'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { NotificationContext } from '../../contexts/NotificationContext'
import { ADD_TO_MAILINGLIST } from '../../mutations/stationMutation'
import { validateEmail } from '../StationReportPage/NewReportForm/validator'

const AddMailingListModal = ({ open ,setOpen ,station }) => {
  const [,dispatch] = useContext(NotificationContext)
  const [emails,setEmails] = useState([])
  const [addAircrafts] = useMutation (ADD_TO_MAILINGLIST,{
    update:(store) => {
      store.modify({
        id: `Station:${station.id}`,
        fields:{
          mailingList(existingAddresses) {


            let newEmails =[]

            forEach(emails, email => {
              if(!existingAddresses.some(ref => {return ref === email})){
                newEmails.push(email)
              }
            })
            return [...existingAddresses, ...newEmails]
          }
        }
      })
    },
    onCompleted: ({ addAircrafts }) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, emails ${emails.toString()}  added` ,type: 'SUCCESS' } })
      setOpen(false)
    },

    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to add emails'}<br/> {err.message}</> ,type: 'ERROR' } })
      setOpen(false)
    }
  })

  return(

    <Formik
      initialValues= {{
        emails: ''
      }}

      validate = { (values) => {

        const errors = {}
        if(values.emails.length ){
          const errEmail =[]
          forEach(values.emails.split(','), email => {
            if(validateEmail(email.trim())) errEmail.push(email)
          })

          if (errEmail.length ){
            errors.emails = `${errEmail.toString()} Invalid emails`
          }
        }else{
          errors.emails = 'Enter at least one Email'
        }
        console.log(errors)
        return errors
      }
      }
      onSubmit= {(values) => {
        setEmails(values.emails.split(','))
        addAircrafts({ variables:{  emails: values.emails.split(','), stationId: station.id } })
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
              <InputField name='emails' label='Emails' type='text' width='8' placeholder='Emails separeted by comma ","'/>
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

export default AddMailingListModal