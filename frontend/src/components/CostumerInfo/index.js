import { useQuery } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Flag, Grid, Header, Icon, Loader, Segment, Table } from 'semantic-ui-react'
import { GET_COSTUMER } from '../../queries/costumerQuey'

const CostumerInfo = ({ costumerData }) => {
  const [data,setData] = useState('')
  const params = useParams()
  const { loading: costumerLoading ,error: costumerError, data: fetchedData } = useQuery(GET_COSTUMER,{ variables:{ id: params.id }, skip: costumerData })

  useEffect(() => {
    if(costumerData){
      setData(costumerData)
    }
    if(fetchedData){
      setData(fetchedData.getCostumer)
    }

  },[costumerData, fetchedData, setData])



  if(!data){
    return null
  }

  if(costumerLoading){
    return <Segment basic ><Loader active> Adding New Costumer</Loader></Segment>
  }

  if(costumerError){
    return <Header as='h4'>Something went wrong</Header>
  }

  return (
    <>
      <Header as='h3'>{data.name}</Header>
      <Grid padded>
        <Grid.Row columns='3'>
          <Grid.Column>
            <Header as= 'h5'> Aircrafts </Header>
            <Segment>
              {data.aircrafts && data.aircrafts.map((aircraft,index) =>
                <Segment key={index} compact style={{ display:'inline-flex', margin:'0' , width:'4.5rem' }}>
                  {aircraft.registration}
                </Segment>)}

            </Segment>
            <Button icon primary><Icon name='add circle'/> Add Aircraft</Button>

          </Grid.Column>
          {
            data.keyContacts && data.keyContacts.length > 0 &&
            <Grid.Column>
              <Header as= 'h5'> Key Contacts </Header>
              <Table>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell> Description </Table.HeaderCell>
                    <Table.HeaderCell> Phone </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    data.keyContacts.map((contact,index) =>
                      <Table.Row key={index}>
                        <Table.Cell>
                          {contact.description}
                        </Table.Cell>
                        <Table.Cell>
                          {contact.phone}
                        </Table.Cell>
                      </Table.Row>)
                  }
                </Table.Body>
              </Table>

              <Button icon primary><Icon name='add circle'/> Add Contact</Button>
            </Grid.Column>
          }
          {
            data.stations && data.stations.length > 0  &&
            <Grid.Column >
              <Header as= 'h5'> Stations </Header>
              <Table padded>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell> Station </Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {
                    data.stations && data.stations.length > 0 && data.stations.map((station,index) =>
                      <Table.Row key={index}>
                        <Table.Cell>
                          {station.location}
                        </Table.Cell>
                        <Table.Cell>
                          {`${station.address.city} , ${station.address.country}`} <Flag name={station.address.country && station.address.country.toLowerCase()}></Flag>
                        </Table.Cell>
                      </Table.Row>)
                  }
                </Table.Body>
              </Table>
              <Button icon primary><Icon name='add circle'/> Add Station</Button>
            </Grid.Column>
          }
        </Grid.Row>
      </Grid>
    </>

  )

}

export default CostumerInfo

