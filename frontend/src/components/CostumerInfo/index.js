import { useMutation, useQuery } from '@apollo/client'

import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Flag, Grid, Header, Icon, Label, Loader, Modal, Segment, Table } from 'semantic-ui-react'
import {  DELETE_COSTUMER, REMOVE_AIRCRFAT, REMOVE_CONTACT, REMOVE_COSTUMER_FROM_STATION } from '../../mutations/costumerMutation'
import { GET_COSTUMER } from '../../queries/costumerQuey'
import AddAircraftModal from './AddAircraftModal'
import AddContactModal from './AddContactModal'
import AddStationModal from './AddStationModal'

const CostumerInfo = ({ costumerData }) => {
  const [data,setData] = useState('')
  const [addStationModalOpen,setAddStationModalOpen] = useState(false)
  const [addAircraftModalOpen,setAddAircraftModalOpen] = useState(false)
  const [addContactModalOpen,setAddContactModalOpen] = useState(false)

  const params = useParams()
  const history = useHistory()
  const { loading: costumerLoading ,error: costumerError, data: fetchedData } = useQuery(GET_COSTUMER,{ variables:{ id: params.id }, skip: costumerData })

  const [removeFromStation] = useMutation(REMOVE_COSTUMER_FROM_STATION )
  const [deleteCostumer] = useMutation(DELETE_COSTUMER, {
    update: (store) => {
      store.evict({ //Remove costumer from all datas
        id: `Costumer:${data.id}`
      })
    }
  })
  const [removeContact] = useMutation( REMOVE_CONTACT )
  const [removeAircraftMut] = useMutation( REMOVE_AIRCRFAT )


  const removeContactFromStation = ({ id }) => {
    removeContact({
      variables:{ id,costumer: data.id },
      update: (store) => {
        console.log(id)
        store.evict({
          id: `Contact:${id}`
        })
      }
    })
  }

  const removeAircraft = ({ id }) => {
    removeAircraftMut({
      variables:{ id },
      update: (store) => {
        store.evict({
          id: `Aircraft:${id}`
        })
      }
    })
  }

  const removeCostumerFromStation = ({ variables  }) => {
    removeFromStation({
      variables: variables,
      update: (store) => {
        store.modify({
          id: `Station:${variables.station}`,
          fields: { // Remove costumer from station
            costumers(existingCostumerRefs, { readField }) {
              return existingCostumerRefs.filter(
                costumersRef =>  data.id !== readField('id', costumersRef)
              )
            }
          },
        },
        )

        store.modify(
          {
            id: `Costumer:${data.id}`,
            fields: { // Remove station from costumer
              stations(existingStationRefs, { readField }) {

                return existingStationRefs.filter(
                  stationsRef => {
                    console.log(variables.station, readField('id', stationsRef), variables.stationId !== readField('id', stationsRef))
                    return variables.station !== readField('id', stationsRef)}
                )
              }
            },

          }
        )
      } })
  }





  const [confirm,setConfirm] = useState({ title:'',fn: () => {} })
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

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
                <Segment key={index} compact style={{ display:'inline-flex', margin:'0.1rem' , width:'4.3rem' }}>
                  <Label floating  size='tiny' style={{ backgroundColor:'transparent' }}>
                    <Icon link  name='cancel' onClick = {() => {
                      setConfirm({ title: `Are you sure you want to  deassign Aircraft ${aircraft.registration} from this Costumer ?`, fn: () => {
                        removeAircraft({ id:aircraft.id })
                      } })
                      setConfirmModalOpen(true)

                    }}></Icon>
                  </Label>
                  {aircraft.registration}
                </Segment>)}

              <Button style={{ marginTop:'1rem', display:'block' }}circular icon primary size='small' onClick= {() => setAddAircraftModalOpen(true)}><Icon name='add'/></Button>
            </Segment>


          </Grid.Column>

          <Grid.Column>
            <Header as= 'h5'> Key Contacts </Header>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell> Description </Table.HeaderCell>
                  <Table.HeaderCell> Phone </Table.HeaderCell>
                  <Table.HeaderCell> Email </Table.HeaderCell>
                  <Table.HeaderCell> </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  data.keyContacts && data.keyContacts.length > 0 && data.keyContacts.map((contact,index) =>
                    <Table.Row key={index}>
                      <Table.Cell>
                        {contact.description}
                      </Table.Cell>
                      <Table.Cell>
                        {contact.phone}
                      </Table.Cell>
                      <Table.Cell>
                        {contact.email}
                      </Table.Cell>
                      <Table.Cell>
                        <Icon link name='cancel' onClick ={() => {
                          setConfirm({ title: `Are you sure you want to  remove contact ${contact.description} from this Costumer ?`, fn: () => {
                            removeContactFromStation({ id: contact.id })
                          } })
                          setConfirmModalOpen(true)

                        }}></Icon>
                      </Table.Cell>
                    </Table.Row>)
                }
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.Cell>
                    <Button circular icon primary size='small'  onClick= {() => setAddContactModalOpen(true)} ><Icon name='add'/></Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Footer>
            </Table>


          </Grid.Column>


          <Grid.Column >
            <Header as= 'h5'> Stations </Header>
            <Table padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell> Station </Table.HeaderCell>
                  <Table.HeaderCell></Table.HeaderCell>
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
                      <Table.Cell>
                        { params.stationId !== station.id &&
                          <Icon link   name='cancel' onClick={() => {
                            setConfirm({ title: `Are you sure you want to  remove station ${station.location} from this Costumer ?`, fn: () => {
                              removeCostumerFromStation({ variables:{ station: station.id, costumer: data.id } })
                            } })
                            setConfirmModalOpen(true)
                          }}/>}
                      </Table.Cell>
                    </Table.Row>)
                }
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.Cell>
                    <Button circular icon primary size='small' onClick= {() => setAddStationModalOpen(true)}><Icon name='add'/></Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Footer>
            </Table>

          </Grid.Column>

        </Grid.Row>

        <Grid.Row>
          {params.stationId &&
          <Button negative
            onClick={() => {
              setConfirm({ title: `Are you sure you want to  remove costumer ${data.name} from this station ?`, fn: () => {
                removeCostumerFromStation({ variables:{ station: params.stationId, costumer: data.id } })
                history.goBack()
              } })
              setConfirmModalOpen(true)
            }}> Remove from Station </Button>
          }

          {!params.stationId &&
          <Button icon negative
            onClick={() => {
              setConfirm({ title: `Are you sure you want to  delete costumer ${data.name} ?` , fn: () => {
                deleteCostumer({ variables:{ costumer: data.id } })
                history.goBack()
              } })
              setConfirmModalOpen(true)
            }}> <Icon name='trash'/> Delete Costumer </Button>}
        </Grid.Row>
      </Grid>


      {confirmModalOpen &&
      <Modal
        open= {confirmModalOpen}
        closeOnEscape= {false}
        closeOnDimmerClick={false}
      >
        <Modal.Header >Confirm</Modal.Header>
        <Modal.Content>{confirm.title}</Modal.Content>
        <Modal.Actions>
          <Button positive onClick= {() => {
            confirm.fn()
            setConfirmModalOpen(false)
          }
          }>Confirm </Button>
          <Button negative  onClick= {() => setConfirmModalOpen(false)}>Cancel </Button>
        </Modal.Actions>
      </Modal>

      }


      {
        addStationModalOpen &&
      <AddStationModal open={addStationModalOpen} setOpen = {setAddStationModalOpen} costumer= {data}></AddStationModal>
      }

      {
        addAircraftModalOpen &&
      <AddAircraftModal open={addAircraftModalOpen} setOpen = {setAddAircraftModalOpen} costumer= {data}></AddAircraftModal>
      }

      {
        addContactModalOpen &&
        <AddContactModal open={ addContactModalOpen} setOpen = {setAddContactModalOpen} costumer= {data}></AddContactModal>
      }

    </>



  )

}

export default CostumerInfo

