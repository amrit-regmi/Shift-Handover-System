import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import { useQuery, useLazyQuery } from '@apollo/client';  
import { Button, Form, Radio, Grid, Header, Image, Label, Segment, Divider, FormGroup } from 'semantic-ui-react'
import {ALL_STATION} from '../queries/stationQuery'


const LandingPage = () => {
  const history = useHistory();
  const [radioButton, setRadioButton] = useState({})
  const {loading, error, data } =  useQuery(ALL_STATION,{notifyOnNetworkStatusChange: true})
  
  if (error) return `Error! ${error}`;
    const displayKeyField = (event,{value,label}) =>{
      setRadioButton({value,label})
  }

  const loginToStation = async (event) => {
    event.preventDefault()
    //TODO:
    //Key verification to be implemente
    history.push(`/shiftReport/station/${radioButton.value}`)
  }

  const RenderPasswordInput = ({radioButton}) => {
    return (<>
           <Form.Input 
            name= 'stationKey'
            label= {`Enter password for ${radioButton.label}`}
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            
          />
          <Form.Checkbox name="rememberKey" label='Remember on this computer'/>
          <Button fluid size='large' color="blue">Retrieve Shift Report</ Button>
          </>)
    
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
            <Radio  label={station.location} value={station.id} checked={ radioButton.value === station.id} onChange={(event,value)=>displayKeyField(event,value)}>
              </Radio>
              </Form.Field>)}
        
          <div style={{clear:'both'}}></div>
          
          {radioButton.value && 
            <RenderPasswordInput radioButton={radioButton}/>
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