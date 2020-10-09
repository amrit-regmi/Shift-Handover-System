import React, { useState,useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Form, Radio, Grid, Header, Image, Segment, Divider } from 'semantic-ui-react'
import { ALL_STATION } from '../queries/stationQuery'
import { LOGIN_TO_STATION } from '../mutations/stationMutation'


const StationLoginPage = () => {
  const history = useHistory()
  const [radioButton, setRadioButton] = useState({})
  const [stationKey,setStationKey]= useState('')
  const [remember, setRemember] = useState(false)
  const { loading, error, data } =  useQuery(ALL_STATION,{ notifyOnNetworkStatusChange: true })

  /**
   * loginStation mutation hook
   */
  const [loginStation,loginToStationResult] = useMutation(LOGIN_TO_STATION,{
    onError: (error) => {
      console.log(error)
    }
  })

  /**
   * side effect when the loginStation mutation is executed and loginToStationResult is set
   */
  useEffect(() => {
    if ( loginToStationResult.data ) {
      const station = loginToStationResult.data.loginToStation
      setStationKey(station)
      sessionStorage.setItem('stationKey',JSON.stringify(station))
      //If remember button is checked store key in local storage
      if(remember){
        localStorage.setItem('stationKey',JSON.stringify(station))
      }
      history.push(`/shiftReport/station/${radioButton.value}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginToStationResult.data])

  /**
   * function for station loginStation action
   * @param {event} event submit button event
   */
  const loginToStation = async (event) => {
    event.preventDefault()
    loginStation({ variables:{ id:radioButton.value, password: stationKey } })

  }

  /**
   * If stationKey is found on localStorage/sessionStorage skip the loginStation and browse shift report
   */
  let storedStationKey = JSON.parse(sessionStorage.getItem('stationKey'))
  if(!storedStationKey){
    const key = localStorage.getItem('stationKey')
    storedStationKey = JSON.parse(key)
    /**
     * store the key to session storage*
     */
    sessionStorage.setItem('stationKey',JSON.stringify(key))
  }
  if(storedStationKey){
    history.push(`/shiftReport/station/${storedStationKey.id}`)
  }

  /**
   * remeber checkbox toggle action
   */
  const toggleRemember = () => {
    if (remember) {
      setRemember(false)
    }else {
      setRemember(true)
    }
  }

  /**
   * Renders station password input filed
   * @param {radioButton DOM} radioButton
   * @returns {Component} password input field
   */

  const renderPasswordInput = (radioButton) => {
    return (
      <>
        <Form.Input
          name= 'stationKey'
          value={stationKey}
          onChange= {({ target }) => setStationKey(target.value)}

          label= {`Enter password for ${radioButton.label}`}
          fluid
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          type='password'


        />
        <Form.Checkbox name="rememberKey" label='Remember on this computer' checked={remember} onClick = {toggleRemember}/>
        <Button fluid size='large' color="blue">Retrieve Shift Report</ Button>
      </>)

  }
  /**
   * Radiobutton change action
   * @param {event} event
   * @param {DOM {value, label}} value,label
   *
   */
  const radioButtonChange = (event,{ value,label }) => {
    setRadioButton({ value,label })
  }

  /**If Login mutation error */
  if (error) return `Error! ${error}`


  return (

    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='blue' textAlign='center'>
          <Image src='/LogoMin.png' /> Please select a station
        </Header>
        <Form size='large' style={{ textAlign:'left' } } onSubmit={loginToStation}>
          <Segment clearing stacked>
            {  loading &&
             <Segment loading basic>
             </Segment>
            }

            {!loading && data.allStations && data.allStations.map(station =>  <Form.Field style={{ float: 'left', clear:'none',  marginRight:'10px' }} key={station.id}>
              <Radio  label={station.location} value={station.id} checked={ radioButton.value === station.id} onChange={(event,value) => radioButtonChange(event,value)}>
              </Radio>
            </Form.Field>)}

            <div style={{ clear:'both' }}></div>

            {radioButton.value && renderPasswordInput(radioButton)
            }


          </Segment>
        </Form>
        <Divider horizontal>Or</Divider>
        <Segment clearing stacked>
          <Button content='Log in to personal page' icon='user'  size='large' color="teal" fluid onClick = {() => history.push('/staffLogin')} />
        </Segment>

      </Grid.Column>

    </Grid>


  )


}

export default StationLoginPage