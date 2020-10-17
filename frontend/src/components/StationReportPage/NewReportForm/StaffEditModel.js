import React, { useState, useEffect } from 'react'
import { Modal,Grid,Header,Form ,Divider,Segment ,Icon,Button,Message, FormGroup, FormField, Dimmer,Loader } from 'semantic-ui-react'
import { DateInputField, InputField } from './FormFields'
import { operateDate, formatDate } from '../../../utils/DateHelper'
import { DateTimeInput } from 'semantic-ui-calendar-react'
import { useFormikContext, Formik } from 'formik'
import { validateEmail, validateName, validateStartEndTime } from './validator'
import { SIGN_OFF_SHIFT } from '../../../mutations/timeSheetMutation'
import { useMutation } from '@apollo/client'
import _ from 'lodash'
//import { remove } from '../../../../../backend/Src/models/Staff'


const  StaffEditModel = ({ setOpen,open, fieldName, removeClick ,removeStaff ,setRemoveStaff }) => {

  const{ getFieldMeta,setFieldValue } = useFormikContext()

  const [signOff,{ loading, error, data }] = useMutation(SIGN_OFF_SHIFT,{
    onError: (error) => {
      console.log(error)
    }
  })

  const shiftStartTime = getFieldMeta(`${fieldName}.startTime`).value
  const shiftEndTime = getFieldMeta(`${fieldName}.endTime`).value
  const ibreakt = getFieldMeta(`${fieldName}.break`).value
  const [notifyResult,setNotifyResult] = useState('')
  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [startTime,setStartTime] = useState(shiftStartTime)
  const [endTime,setEndTime] = useState(shiftEndTime)
  const [breakt,setBreakt] = useState(ibreakt)

  useEffect(() => {
    setStartTime(shiftStartTime)
    setEndTime(shiftEndTime)
  },[shiftEndTime, shiftStartTime])


  useEffect (() => {
    /**If the staff sign off is not sucessfull */
    if(error){
      setNotifyResult({ type: 'error', message:`Sorry, ${error.message}` })
    }
    /**
     * If the staff signoff is successFull
     */
    if(data && data.signOffTimeSheet != null ){

      if(removeStaff) {
        removeClick()
        setRemoveStaff(false)
        setOpen(false)

      }else {
        setFieldValue(`${fieldName}.startTime`,data.signOffTimeSheet.startTime)
        setFieldValue(`${fieldName}.endTime`,data.signOffTimeSheet.endTime)
        setFieldValue(`${fieldName}.signOffKey`,data.signOffTimeSheet.value)
        setOpen(false)

      }





    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[error, data])

  const submit = async (values) => {
    let signOffData
    signOffData = { startTime:values.startTime ,endTime: values.endTime ,break: values.breakt, username: username, password: password, additionalAction: removeStaff?'remove':'update',id:getFieldMeta(`${fieldName}`).value.id }

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

  if(loading){
    return<Dimmer active inverted>
      <Loader active inverted>Verifying</Loader>
    </Dimmer>
  }

  return (
    <Modal
      closeIcon
      closeOnEscape={false}
      closeOnDimmerClick={false}
      open = {open}
      onClose= {() => {

        setNotifyResult(false)
        setOpen(false)}}
      onOpen= {() => setOpen (true)}
    >
      <Modal.Header>{getFieldMeta(`${fieldName}.name`).value} </Modal.Header>
      <Modal.Content>
        {notifyResult &&
         renderAlert()
        }
        <Formik
          enableReinitialize
          initialValues = {{
            startTime: startTime,
            endTime: endTime,
            breakt: breakt,
            username:'',
            password:'',
            email:'',
            fullname:'',
            resetEmail:''
          }}

          validate = {values => {
            let errors = {}
            errors = { ...errors,...validateStartEndTime(values.startTime,values.endTime) }
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

                <InputField
                  inputlabel= 'Break'
                  label = 'Minutes '
                  labelPosition='right corner'
                  name= 'breakt'
                  type='number'
                  min='0'
                  onChange = {(e,{ value }) => {
                    setBreakt(value)}
                  }>
                </InputField>



              </Form.Group>

              <Header as='h3' color='red' textAlign='center'>
                {removeStaff?'Enter credentials to confirm remove.' : 'Enter credential to save changes'}

              </Header>


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

              </>
            </Form>}
        </Formik>
      </Modal.Content>

    </Modal>


  )
}

export default StaffEditModel