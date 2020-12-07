import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, Flag, Grid, Header, Icon, Loader, Menu, Segment, Table } from 'semantic-ui-react'
import { GET_STATION } from '../../queries/stationQuery'
import { formatDate } from '../../utils/DateHelper'
import StationMenu from './stationMenu'

const StationInfo = (props) => {
  const [stationData, setStationData] = useState('')
  const [activeItem,setActiveItem] = useState('BasicInfo')



  let stationId = useParams().stationId
  /** If stationId is passed as props then passed stationId should have precedence over params */
  if(props.stationId){
    stationId = props.stationId
  }

  const loggedInStaff = JSON.parse( sessionStorage.getItem('staffKey'))

  const { loading } = useQuery(GET_STATION, {
    variables: { id: stationId },
    skip: !stationId,
    onCompleted: (data) => setStationData(data.getStation)
  } )

  console.log(stationData)

  if(!stationId || !stationData || loading ){
    return(
      <Segment basic>
        <Loader active>Loading Station</Loader>
      </Segment>
    )

  }

  return (
    <>
      <StationMenu station= {stationData} activeItem ={activeItem} setActiveItem= {setActiveItem}></StationMenu>
      {activeItem === 'BasicInfo' &&
        <Grid padded>
          <Grid.Row columns='4'>
            <Grid.Column >
              <Header as ='h4' >Address:
                <Header.Subheader>{stationData.address.street }<br/>
                  {stationData.address.postcode }{stationData.address.city}<br/>
                  {stationData.address.country} <Flag name={stationData.address.country.toLowerCase()}></Flag></Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header as ='h4' >Contact:
                <Header.Subheader><strong>Email: </strong> {stationData.email}<br/>
                  <strong>Phone: </strong>
                  {stationData.phone.reduce((p,c) => p + ' / ' + c)}</Header.Subheader>
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header as ='h4' >Shifts:
                {stationData.shifts.map((shift,i) => <Header.Subheader key={i}> {shift.name} <strong> Starts at: </strong> {shift.startTime}<br/></Header.Subheader> )}
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Header as ='h4'>Current Staffs:</Header>
              <Table collapsing>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell > Name </Table.HeaderCell>
                    <Table.HeaderCell> Last Active At:  </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {stationData.staffList.length > 0 && stationData.staffList.map((staff,i ) => <Table.Row key={i}>
                    <Table.Cell>
                      {
                        loggedInStaff.permission.staff.view?
                          <Link to={`/Manage/AllStaffs/${staff.id}/Profile`}>{staff.name}</Link>: staff.name
                      }
                    </Table.Cell>
                    <Table.Cell>{formatDate(staff.lastActive.activeAt)}</Table.Cell>
                  </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      }

      {activeItem === 'Procedures' &&
      <Header as='h5'> This Station Procedure feature is not Implemented yet, will be implemanted soon ...
        <Header.Subheader>
          After this implemetation, one will be able to add/ view / search all the station related procedure such as 'Garbage Disposal , Hanger Booking , Supplies Delivery ...' on this section
        </Header.Subheader>
      </Header>}

      {activeItem === 'Costumers' &&
      <>
        {stationData.costumers && stationData.costumers.map(costumer =>
          <Card key={costumer.id} link raised as={Link} to='/Manage/AllStaffs'>
            <Card.Content textAlign='center' header = {costumer.name} />
            <Card.Content textAlign='center' >{costumer.contract? costumer.contract + ' Contract':''}</Card.Content>
            <Card.Content textAlign='center' extra>
              <Header as ='h5'> <Icon name='plane'/> Total Aircrafts: {costumer.aircrafts.length}</Header>
            </Card.Content>
          </Card>)}
        <Button primary icon floated='left'><Icon name='add circle'/> Add More </Button>
      </>
      }

      {activeItem === 'Settings' &&
      <Header as='h5'> This Station Settings feature is not Implemented yet, will be implemanted soon ...
        <Header.Subheader>
          After this implemetation, one will be able to change station settings such as 'SignIn/Off Work Methods', 'Add Remove Shifts', 'Number of active reporting', 'Change Station Key'
        </Header.Subheader>
      </Header>}
    </>
  )


}
export default StationInfo