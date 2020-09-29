import React, { useState, useEffect } from 'react'
import { Modal,Grid,Header,Form ,Divider,Segment ,Icon,Button,Message, FormGroup, FormField, Dimmer,Loader } from 'semantic-ui-react'
import { DateInputField, InputField } from './FormFields'
import { operateDate, formatDate } from '../../../utils/DateHelper'
import { useFormikContext, Formik } from 'formik'
import { validateEmail, validateName, validateStartEndTime } from './validator'
import { SIGN_OFF_SHIFT } from '../../../mutations/timeSheetMutation'
import { useMutation } from '@apollo/client'
import _ from 'lodash'


const  StaffAddModel = ({ setOpen,open ,e }) => {

  const{ getFieldMeta,setFieldValue } = useFormikContext()

  const [signOff,{ loading, error, data }] = useMutation(SIGN_OFF_SHIFT,{
    onError: (error) => {
      console.log(error)
    }
  })

  const shiftStartTime = getFieldMeta('startTime').value
  const shiftEndTime = getFieldMeta('endTime').value
  const [notifyResult,setNotifyResult] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [startTime,setStartTime] = useState(shiftStartTime)
  const [endTime,setEndTime] = useState(shiftEndTime)
  const [registerUserOpen,setRegisterUserOpen]= useState(false)
  const [forgotPasswordOpen,setForgotPasswordOpen] = useState(false)

  useEffect(() => {
    setStartTime(shiftStartTime)
    setEndTime(shiftEndTime)
  },[shiftEndTime, shiftStartTime])


  useEffect (() => {
    /**If the staff sign off is not sucessfull */
    if(error){
      if(registerUserOpen){
        setNotifyResult({ type: 'error', message:`Failed to register user. ${error.message}` })
      }if(forgotPasswordOpen){
        setNotifyResult({ type: 'error', message:`Failed to reset password. ${error.message}` })
      }
      else{
        setNotifyResult({ type: 'error', message:`Failed to add user. ${error.message}` })
      }
    }
    /**
     * If the staff signoff is successFull
     */
    if(data && data.signOffTimeSheet != null ){
      /**
       * Check if the staff is alrady added if so notify user to remove old entry
       */
      const staffs= getFieldMeta('staffs').value
      if(_.find(staffs,{ id:data.signOffTimeSheet.id })){

        setNotifyResult({ type: 'error', message: `${data.signOffTimeSheet.name} is already exist on report` } )

      }else {
        const addedStaff = [...staffs,{ name:data.signOffTimeSheet.name, startTime:data.signOffTimeSheet.startTime, endTime: data.signOffTimeSheet.endTime ,signedOffKey:data.signOffTimeSheet.value ,id: data.signOffTimeSheet.id }]
        setFieldValue('staffs', addedStaff)

        if(registerUserOpen){

          setNotifyResult({ type: 'success', message:`${data.signOffTimeSheet.name} is added to report.<br/> Further registration instruction sent to email. Please complete registration within 48 hours` })
          setRegisterUserOpen(false)

        }if(forgotPasswordOpen){
          setNotifyResult({ type: 'success', message:`${data.signOffTimeSheet.name} is added to report <br/> Password reset link sent to email.`  })
          setForgotPasswordOpen(false)
        }
        else{
          setNotifyResult({ type: 'success', message: `${data.signOffTimeSheet.name} is added to report` } )
        }
      }

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[error, data])





  const submit = async (values) => {

    let signOffData

    if(registerUserOpen){
      signOffData = {  startTime:values.startTime ,endTime:values.endTime ,email: values.email, name: values.fullname ,additionalAction:'register' }
    }
    else if(forgotPasswordOpen){
      signOffData = { startTime:values.startTime ,endTime:values.endTime ,email:values.resetEmail,additionalAction:'reset' }
    }else {
      signOffData = { startTime:values.startTime ,endTime: values.endTime ,username: username, password: password }
    }
    console.log(signOffData)
    await signOff({ variables:signOffData })
  }

  const renderAlert = () => {
    if(!notifyResult) return null
    return(
      <Message
        success = {notifyResult.type === 'success'}
        error = {notifyResult.type === 'error'}
        onDismiss = {() => setNotifyResult('')
        }
      > {notifyResult.message}
      </Message>)


  }
  const renderNewUserInput = (values) => {

    return(

      <Segment basic>
        <Message positive>
          <Message.Header>Register info</Message.Header>

            Please enter following information to add yourself to shift . Registraion instruction will be forwarded to you on the provided email.
            It is important that you register as soon as possible.
        </Message>

        <Message warning visible>
          <Message.Header>Attention!!</Message.Header>
        Your info will be added to report automatically after this step, make sure you enter your name and work time correctly
        </Message>
        <Form.Group>
          <InputField width= '12' name ='fullname' label='Full Name' />
          <InputField width= '12' name = 'email' label = 'Email Address'/>
        </Form.Group>
        <FormGroup>
          <Button  positive >Register</Button>
          <Button type='button' negative onClick ={() => setRegisterUserOpen(false)}>Cancel</Button>
        </FormGroup>


      </Segment>
    )
  }

  const renderForgotPassword = (values) => {
    return(
      <Segment basic>
        <Message warning visible>
          <Message.Header>Reset Password</Message.Header>
            Please enter your email address used while creating account.
        </Message>

        <Message warning visible>
          <Message.Header>Attention!!</Message.Header>
        Your info will be added to report automatically after this step, make sure you <strong>Enter your work time correctly</strong>
        </Message>

        <InputField width= '12' name = 'resetEmail'label = 'Email Address'/>
        <FormGroup>
          <Button  primary >Reset</Button>
          <Button  negative onClick ={() => setForgotPasswordOpen(false)}>Cancel</Button>
        </FormGroup>
      </Segment>
    )
  }


  if(loading){
    return<Dimmer active inverted>
      <Loader active inverted>Veryfing User</Loader>
    </Dimmer>
  }

  return (
    <Modal
      closeIcon
      closeOnEscape={false}
      closeOnDimmerClick={false}
      open = {open}
      onClose= {() => {
        setForgotPasswordOpen(false)
        setRegisterUserOpen(false)
        setNotifyResult(false)
        setOpen(false)}}
      onOpen= {() => setOpen (true)}
    >
      <Modal.Header>Add User to Shift </Modal.Header>
      <Modal.Content>

        {notifyResult &&
         renderAlert()
        }

        <Formik
          enableReinitialize
          initialValues = {{
            startTime: startTime,
            endTime: endTime,
            username:'',
            password:'',
            email:'',
            fullname:'',
            resetEmail:''
          }}

          validate = {values => {
            let errors = {}
            errors = { ...errors,...validateStartEndTime(values.startTime,values.endTime) }

            if(forgotPasswordOpen){
              let emailError = validateEmail(values.resetEmail)
              if(emailError) errors.resetEmail = emailError
            }
            if(registerUserOpen){
              let emailError = validateEmail(values.email)
              if(emailError) errors.email = emailError

              let usernameError = validateName(values.fullname)
              if(usernameError) errors.fullname = usernameError

            }
            console.log(errors)
            return errors
          } }

          onSubmit = {(values) =>
          {
            console.log(values ,'submitted')
            submit(values)}
          }


        >


          {({ values,handleSubmit,errors,touched }) =>

            <Form size='large' onSubmit = { handleSubmit} >
              <Form.Group >

                < DateInputField
                  label= 'Start Time'
                  dateTimeFormat = 'DD-MM-YYYY HH:mm'
                  name ='startTime'
                  maxDate = {operateDate(Date.now(),30,'m','sub')}
                  minDate= {operateDate(Date.now(),20,'h','sub')}
                  onChange = {(e,{ value }) => {
                    setStartTime(value)}
                  }
                />


                < DateInputField
                  label = 'End Time'
                  dateTimeFormat = 'DD-MM-YYYY HH:mm'
                  name='endTime'
                  maxDate = {formatDate(Date.now())}
                  minDate= {operateDate(startTime,20,'m','add')}
                  onChange = {(e,{ value }) => {
                    setEndTime(value)}
                  }/>



              </Form.Group>

              <Header as='h5' color='blue' textAlign='center'>

              </Header>

              {!registerUserOpen && !forgotPasswordOpen &&


            <>
              <Segment >

                <Grid columns={2} stackable >
                  <Divider vertical>Or</Divider>
                  <Grid.Row verticalAlign='middle'>
                    <Grid.Column>
                      <Grid.Row style={{ textAlign:'center' }}>
                        <Header as ='h5' icon>
                          <Icon name='sign in alternate' />
                    Use Credentials
                        </Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Form.Group>
                          <Form.Input label='Username' onChange= {(e,{ value }) => setUsername(value)}></Form.Input>
                          <Form.Input label= 'Password' type='password' onChange= {(e,{ value }) => setPassword(value)}></Form.Input>
                        </Form.Group>
                        <Form.Field style={{ textAlign:'center' }}>
                          <Button type='submit' primary > Sign </Button>
                        </Form.Field>
                        <Form.Field style={{ textAlign:'center' }}>
                          <Button size='tiny' onClick={() => setForgotPasswordOpen(true)}>Forgot Password</Button>
                        </Form.Field>
                      </Grid.Row>
                    </Grid.Column>

                    <Grid.Column textAlign='center'>
                      <Grid.Row >
                        <Header icon>
                          <Icon name='barcode' size='massive' />
                  Use IdCard
                        </Header>
                      </Grid.Row>
                      <Grid.Row><Button primary>Scan</Button></Grid.Row>

                    </Grid.Column>
                  </Grid.Row>
                </Grid>

              </Segment>
              <FormField style={{ textAlign:'center' }}>
                <label> If you do not have a account yet, contact your supervisor or click below.</label>
                <Button type='button' onClick={() => setRegisterUserOpen(true)}> New User </Button>
              </FormField>
            </>
              }


              {registerUserOpen && renderNewUserInput( values)}
              {forgotPasswordOpen && renderForgotPassword(values)}
            </Form>}
        </Formik>
      </Modal.Content>

    </Modal>


  )
}

export default StaffAddModel