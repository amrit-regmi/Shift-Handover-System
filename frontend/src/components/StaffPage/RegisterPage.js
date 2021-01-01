import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Form, Header, Icon, Input, Label,  Message, Segment } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { COMPLETE_REGISTRATION } from '../../mutations/staffMutation'
import { GET_STAFF_REG,VERIFY_USERNAME } from '../../queries/staffQuery'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
const RegisterPage = ({ setName }) => {
  const [,dispatch] = useContext(NotificationContext)
  const params= useParams()
  const history = useHistory()

  const { loading,error,data } = useQuery(GET_STAFF_REG, { variables: { registerCode: params.registerCode }, skip: !params.registerCode  })
  const [completeRegistration,{ loading:regstrationLoading,data:registrationData }] = useMutation(COMPLETE_REGISTRATION,{
    onError: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to register'}<br/> {err.message}</> ,type: 'ERROR' }
      })}
  })
  const [validateUsernameQuery,{ loading:usernameLoading,data:usernameData }] = useLazyQuery(VERIFY_USERNAME)
  const [usernameVerified,setUsernameVerified] = useState({ verified:false })


  useEffect(() => {
    if(usernameData){

      setUsernameVerified({ verified:true,status:usernameData.verifyUsername.status })
      //setFieldError('username','This is a error')
    }

  }, [usernameData])

  if(!params.registerCode){
    return <Header>Registration code mising or invalid</Header>
  }

  if(registrationData && registrationData.registerStaff.status === 'SUCCESS'){
    history.push('/staff')
    return null
  }

  if(data && data.getStaff){
    setName(data.getStaff.name)
  }


  const initVal = {
    password:'',
    username:'',
    confirmPassword:''
  }

  const validateUsername =(value) => {
    validateUsernameQuery({ variables:{ username:value } })

  }


  return(
    <Segment basic loading ={loading || regstrationLoading}>
      <Message success={data && data.getStaff} error={error?true:false}>
        <Message.Header>
          {data && data.getStaff && 'Please complete registration by setting  your username and password'}
          {error && error.message}
          {(data && !data.getStaff) && 'Registration code Invalid'}
        </Message.Header>
      </Message>

      { data && data.getStaff &&
      <Formik
        initialValues = { initVal }
        validate= {(values) =>
        {
          const errors = {}

          if(!values.username || values.username.trim() === ''){
            errors.username = 'Username is required'
          }

          if(values.username && values.username.length < 4){
            errors.username = 'Username should be at least 4 character long'
          }
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

          completeRegistration({ variables:{ registerCode: params.registerCode, password: values.password ,username: values.username } })


        }}
      >
        {({ values,handleChange, handleSubmit,dirty ,errors, handleBlur, touched }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>

          <Form.Field width='8'>
            <Input
              loading={usernameLoading}
              icon= {<Icon name= {errors.username === undefined && usernameVerified.verified?(usernameVerified.status==='SUCCESS'?'check circle':'cancel'):''} color={usernameVerified.verified?usernameVerified.status==='SUCCESS'?'green':'red':'red'} />}
              onBlur= {handleBlur}
              name='username' label='Username' width='8' onChange = {e => {
              // call the built-in onchange
                handleChange(e)
                let username = e.currentTarget.value
                validateUsername(username)
              }}/>

            { ((errors.username && touched.username) ||  (errors.username === undefined && usernameVerified.verified && usernameVerified.status!=='SUCCESS')) &&
           <Label pointing prompt>
             { errors.username || 'Selected username already taken, please select new username' }
           </Label>}
          </Form.Field>




          <InputField name='password' label='Password' type='password' width='8'/>

          <InputField name='confirmPassword' label='Confirm Password' type='password' width='8'/>


          <Button disabled = {!( dirty && _.isEmpty(errors) && usernameVerified.verified && usernameVerified.status ==='SUCCESS') }type='submit' style={{ marginTop: '1rem' }} positive>Register</Button>

        </Form>
        }
      </Formik>}
    </Segment>

  )
}
export default RegisterPage