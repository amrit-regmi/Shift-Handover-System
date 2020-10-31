import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React from 'react'
import { Button, Dimmer, Form, Grid, Loader, Modal,ModalContent, ModalHeader } from 'semantic-ui-react'
import { CHANGE_PASSWORD } from '../../mutations/staffMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
const PasswordChangeModel = (props) => {

  const [changePassword,{ loading,error,data }] = useMutation(CHANGE_PASSWORD)


  const initVal = {
    password:'',
    newPassword:'',
    confirmPassword:''
  }

  if(error){
    console.log(error)
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
      <ModalHeader>Password Change</ModalHeader>
      <ModalContent>

        {loading &&
            <Dimmer active>
              Updating Password
              <Loader />
            </Dimmer>
        }

        <Formik
          initialValues = { initVal }
          validate= {(values) =>
          {
            const errors = {}
            if(!values.password){
              errors.password = 'Old Password is required'
            }

            if(values.newPassword === values.password){
              errors.newPassword = 'New password cannot be same as old password'
            }

            if(!values.newPassword ){
              errors.newPassword = 'New password cannot be empty'
            }

            if(values.newPassword !== values.confirmPassword){
              errors.confirmPassword = 'New password and confirm password must match'
            }
            console.log(errors)
            return errors
          }

          }
          onSubmit= {(values) => {
            changePassword({ variables:{ id:props.id,password: values.password, newPassword: values.newPassword } })

          }}
        >
          {({ values,handleSubmit,setFieldValue,dirty ,errors }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>
            <Grid>
              <Grid.Row>
                <InputField name='password' label='Old Password' type='password'/>
              </Grid.Row>
              <Grid.Row>
                <InputField name='newPassword' label='New Password' type='password'/>

              </Grid.Row>
              <Grid.Row>
                <InputField name='confirmPassword' label='Confirm Password' type='password'/>
              </Grid.Row>
            </Grid>
            {dirty && _.isEmpty(errors) &&
            <Button type='submit' style={{ marginTop: '1rem' }} positive>Change Password</Button>}

          </Form>
          }
        </Formik></ModalContent>
    </Modal>

  )
}

export default PasswordChangeModel