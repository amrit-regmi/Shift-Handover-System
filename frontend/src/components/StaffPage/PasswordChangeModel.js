import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useContext } from 'react'
import { Button, Dimmer, Form, Grid, Loader, Modal,ModalContent, ModalHeader } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { CHANGE_PASSWORD } from '../../mutations/staffMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
const PasswordChangeModel = (props) => {

  const [,dispatch] = useContext(NotificationContext)
  const [changePassword,{ loading }] = useMutation(CHANGE_PASSWORD,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, password cahanged' ,type: 'SUCCESS' } })
      props.setOpen(false)
    },

    onError: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to change password'}<br/> {err.message}</> ,type: 'ERROR' } })
      props.setOpen(false)
    }
  })


  const initVal = {
    password:'',
    newPassword:'',
    confirmPassword:''
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
            return errors
          }

          }
          onSubmit= {(values) => {
            changePassword({ variables:{ id:props.id,password: values.password, newPassword: values.newPassword } })

          }}
        >
          {({ handleSubmit,dirty ,errors }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>
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