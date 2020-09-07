import React, { useState } from 'react'
import { useQuery } from '@apollo/client';  
import { Button, Form, Radio, Grid, Header, Image, Dimmer,Loader, Segment, Divider, FormGroup } from 'semantic-ui-react'
import {ALL_STATION} from '../queries/stationQuery'

const LandingPage = () => {
  const [radioButton, setRadioButton] = useState({})
  const {loading, error, data } =  useQuery(ALL_STATION,{notifyOnNetworkStatusChange: true})
  
  if (error) return `Error! ${error}`;
  
  const displayKeyField = (event,{value,label}) =>{
      setRadioButton({value,label})
  }

  const loginStation = (event) => {
    event.preventDefault()
    console.log(event.target)
  }

  const RenderPasswordInput = ({radioButton}) => {
    return (<>
           <Form.Input 
            label= {`Enter password for ${radioButton.label}`}
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
            
          />
          <Form.Checkbox label='Remember on this computer' />
          <Button fluid size='large' color="blue">Retrieve Shift Report</ Button>
          </>)
    
  }
  return (

    <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
      <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='blue' textAlign='center'>
        <Image src='/LogoMin.png' /> Please select a station
      </Header>
      <Form size='large' style={{ textAlign:'left' } } onSubmit={loginStation}>
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