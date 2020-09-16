import React, { useState,useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { Button, Form, Radio, Grid, Header, Image, Segment, Divider } from 'semantic-ui-react'
import { ALL_STATION } from '../queries/stationQuery'
import { LOGIN_TO_STATION } from '../mutations/stationMutation'


const LandingPage = () => {
  const history = useHistory()
  const [radioButton, setRadioButton] = useState({})
  const [stationKey,setStationKey]= useState('')
  const [remember, setRemember] = useState(false)
  const { loading, error, data } =  useQuery(ALL_STATION,{ notifyOnNetworkStatusChange: true })

  const [login,result] = useMutation(LOGIN_TO_STATION,{
    onError: (error) => {
      console.log(error)
    }
  })

  useEffect(() => {
    if ( result.data ) {
      const station = result.data.loginToStation
      setStationKey(station)
      sessionStorage.setItem('stationKey',JSON.stringify(station))

      if(remember){
        localStorage.setItem('stationKey',JSON.stringify(station))
      }
      history.push(`/shiftReport/station/${radioButton.value}`)
    }
  }, [history, radioButton.value, remember, result, result.data])

  const loginToStation = async (event) => {
    event.preventDefault()
    login({ variables:{ id:radioButton.value, password: stationKey } })

  }

  /**
   * If stationKey is found on local storage skip the login and browse shift report
   */
  const storedStationKey = JSON.parse(localStorage.getItem('stationKey'))
  if(storedStationKey){
    history.push(`/shiftReport/station/${storedStationKey.id}`)
  }


  const toggleRemember = () => {
    if (remember) {
      setRemember(false)
    }else {
      setRemember(true)
    }
  }


  const renderPasswordInput = (radioButton) => {
    return (<>
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

  if (error) return `Error! ${error}`
  const displayKeyField = (event,{ value,label }) => {
    setRadioButton({ value,label })
  }
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
              <Radio  label={station.location} value={station.id} checked={ radioButton.value === station.id} onChange={(event,value) => displayKeyField(event,value)}>
              </Radio>
            </Form.Field>)}

            <div style={{ clear:'both' }}></div>

            {radioButton.value && renderPasswordInput(radioButton)
            }


          </Segment>
        </Form>
        <Divider horizontal>Or</Divider>
        <Segment clearing stacked>
          <Button content='Log in to personal page' icon='user'  size='large' color="teal" fluid />
        </Segment>

      </Grid.Column>

    </Grid>


  )


}

export default LandingPage