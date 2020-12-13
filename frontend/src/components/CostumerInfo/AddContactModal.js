import { gql, useMutation } from '@apollo/client'
import React, { Fragment } from 'react'
import { ADD_CONTACT } from '../../mutations/costumerMutation'
import { forEach } from 'lodash'
import { Button, Form, Icon, Modal } from 'semantic-ui-react'
import { FieldArray, Formik } from 'formik'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { validateEmail } from '../StationReportPage/NewReportForm/validator'

const AddContactModal = ({ open ,setOpen ,costumer }) => {

  const [addContacts] = useMutation (ADD_CONTACT,{
    update:(store,{ data: { addContact } }) => {

      store.modify({
        id: `Costumer:${costumer.id}`,
        fields:{
          keyContacts(existingContactsRefs, { readField }) {

            let newContactRefs =[]

            forEach(addContact,( contact) => {
              if(existingContactsRefs.some(ref => readField('id',ref) !== contact.id)){
                newContactRefs.push(store.writeFragment({
                  data:contact,
                  fragment: gql`
                fragment NewContact on Contact {
                  id
                  email
                  phone
                  description
                }
              `
                }))
              }
            })
            return [...existingContactsRefs, ...newContactRefs]
          }
        }
      })
    }
  })

  return(

    <Formik
      initialValues= {{
        keyContacts: [{ description:'',phone:'' ,email:'' }]
      }}

      validate = { (values) => {

        const errors = {}
        if(values.keyContacts.length){
          forEach(values.keyContacts, (contact,index) => {
            if(!contact.description){
              if (!errors.keyContacts) errors.keyContacts=[]
              if (!errors.keyContacts[index] ) errors.keyContacts[index] = {}
              errors.keyContacts[index].description = 'Please provide contact description'
            }

            if(!contact.phone && !contact.email){
              if (!errors.keyContacts) errors.keyContacts=[]
              if (!errors.keyContacts[index] ) errors.keyContacts[index] = {}

              errors.keyContacts[index].phone = 'At least a phone or a email is required'
              errors.keyContacts[index].email = 'At least a phone or a email is required'
            }

            if(contact.email){
              if(validateEmail(contact.email)){
                if (!errors.keyContacts) errors.keyContacts=[]
                if (!errors.keyContacts[index] ) errors.keyContacts[index] = {}
                errors.keyContacts[index].email = 'Invalid Email'
              }
            }

          }
          )
        }

        return errors
      }
      }
      onSubmit= {(values) => {

        addContacts({ variables:{ ...values, costumer: costumer.id } })
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
              <FieldArray  name={'keyContacts'}>
                {({ push,remove }) => (<>
                  { values.keyContacts.length > 0 && values.keyContacts.map((contact,index) => <Fragment key ={index}>
                    <Form.Group style={{ margin:0 }} widths='13' ><InputField name={`keyContacts[${index}].description`} label='Description' /><InputField name={`keyContacts[${index}].phone`} label='Phone' /><InputField name={`keyContacts[${index}].email`} label='Email' />
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
                    onClick={ () => push ({ description:'',phone:'' ,email:'' })
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

export default AddContactModal