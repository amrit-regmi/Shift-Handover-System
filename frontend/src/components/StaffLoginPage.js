import React, { useState,useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Form, Radio, Grid, Header, Image, Segment, Divider } from 'semantic-ui-react'
import { ALL_STATION } from '../queries/stationQuery'
import { LOGIN_STAFF } from '../mutations/staffMutation'


const StaffLoginPage = () => {
  const history = useHistory()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  /**
   * staff Login mutation hook
   */
  const [login,{ loading, error, data }] = useMutation(LOGIN_STAFF,{
    onError: (error) => {
      console.log(error)
    }
  })

  /**
   * side effect when the staff login mutation is executed and loginToStationResult is set
   */
  useEffect(() => {
    if ( data ) {
      const staff = data.staffLogin
      sessionStorage.setItem('staffKey',JSON.stringify(staff))
      history.push(`/staff/${staff.id}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  /**
   * function for station loginStation action
   * @param {event} event submit button event
   */
  const handleLogin = async (event) => {
    event.preventDefault()
    login({ variables:{ username:username, password: password } })

  }

  /**
   * If stationKey is found on localStorage/sessionStorage skip the loginStation and browse shift report
   */
  let storedStaffKey = JSON.parse(sessionStorage.getItem('staffKey'))
  if(storedStaffKey){
    history.push(`/staff/${storedStaffKey.id}`)
  }

  /**If Login mutation error */
  if (error) return `Error! ${error}`


  return (

    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
          <Image src='/LogoMin.png' />  Log-in to your account
        </Header>
        <Form size='large' style={{ textAlign:'left' } } onSubmit={handleLogin}>
          <Segment stacked>
            <Form.Input fluid icon='user' iconPosition='left' placeholder='username' onChange = {(e,{ value }) => setUsername(value) }/>
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='Password'
              type='password'
              onChange = {(e,{ value }) => setPassword(value) }
            />
            <Button type = 'submit' color='blue' fluid size='large' >
            Login
            </Button>

          </Segment>
        </Form>
        <Divider horizontal>Or</Divider>
        <Segment  stacked>
          <Button type = 'button' content='Log in to station'size='large' color="teal" fluid
            onClick = {() => history.push('/stationLogin')}/>
        </Segment>

      </Grid.Column>

    </Grid>


  )


}

export default StaffLoginPage