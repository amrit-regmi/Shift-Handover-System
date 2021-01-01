import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Card, Header, Icon, Loader, Segment } from 'semantic-ui-react'
import { ALL_COSTUMERS } from '../../queries/costumerQuey'
import NewCostumerModel from './NewCostumerModal'


const Costumers = () => {

  const [costumerAddOpen,setCostumerAddOpen] = useState(false)
  const { loading,error,data } = useQuery(ALL_COSTUMERS,{ variables: { detailed: true } })

  const location = useLocation()

  if(!data && !loading){
    return null
  }

  if(loading){
    return <Segment basic ><Loader active> Loading Costumer Data</Loader></Segment>
  }

  if(error){
    return <Header as='h4'>Something went wrong</Header>
  }

  return (
    <>
      <Button primary icon style={{ marginBottom: '1rem' }} onClick= {() => setCostumerAddOpen(true)}><Icon name='add circle' />Add New Costumer</Button>
      {
        data && data.allCostumers.length> 0 &&
    <Card.Group>
      {
        data.allCostumers.map(costumer =>
          <Card key={costumer.id} link raised as={Link} to={`${location.pathname}/${costumer.id}`}>
            <Card.Content textAlign='center' header = {costumer.name} />
            <Card.Content textAlign='center' >{costumer.contract? costumer.contract + ' Contract':''}</Card.Content>
            <Card.Content textAlign='center' extra>
              <Header as ='h5'> <Icon name='plane'/> Total Aircrafts: {costumer.aircrafts && costumer.aircrafts.length}</Header>
            </Card.Content>
          </Card>
        )}
    </Card.Group>
      }

      {
        !data.allCostumers &&
    <Header as='h4'>No Costumer Data</Header>
      }

      {costumerAddOpen &&
        <NewCostumerModel open={costumerAddOpen} setOpen= {setCostumerAddOpen}></NewCostumerModel>
      }
    </>
  )



}

export default Costumers