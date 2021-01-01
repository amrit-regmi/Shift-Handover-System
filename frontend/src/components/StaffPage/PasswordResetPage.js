import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useContext } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Form, Header, Segment } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { RESET_PASSWORD } from '../../mutations/staffMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
const PasswordResetPage = () => {
  const[,dispatch] = useContext(NotificationContext)
  const params= useParams()
  const history = useHistory()

  sessionStorage.removeItem('staffKey') //Logout any logged in staff

  const [resetPassword,{ loading }] = useMutation(RESET_PASSWORD,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content:'Success, password reset. you can now login',type: 'SUCCESS' } })
      history.push('/staffLogin')
    },

    onError: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, password reset failed '}<br/> {err.message}</> ,type: 'ERROR' } })
    }
  })

  if(!params.resetCode){
    return <Header>Reset code mising or invalid</Header>
  }

  const initVal = {
    password:'',
    confirmPassword:''
  }

  return(
    <Segment basic loading ={loading}>
      <Formik
        initialValues = { initVal }
        validate= {(values) =>
        {
          const errors = {}
          if(!values.password || values.password.trim() === '') {
            errors.password = 'Password is required'
          }

          if(values.password !== values.confirmPassword){
            errors.confirmPassword = 'New password and confirm password must match'
          }

          return errors
        }

        }
        onSubmit= {(values) => {

          resetPassword({ variables:{ resetCode: params.resetCode, password: values.password } })


        }}
      >
        {({ handleSubmit,dirty ,errors }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>
          <Segment>
            <InputField name='password' label='New Password' type='password' width='8'/>

            <InputField name='confirmPassword' label='Confirm Password' type='password' width='8'/>

            <Button disabled = {!( dirty && _.isEmpty(errors)) } type='submit' style={{ marginTop: '1rem' }} positive>Reset</Button>

          </Segment>


        </Form>
        }
      </Formik>
    </Segment>

  )
}
export default PasswordResetPage