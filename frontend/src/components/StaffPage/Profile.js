import { useQuery } from '@apollo/client'
import React from 'react'
import { Button, Dimmer, Grid,Header,Icon,Loader, Segment, Table, TableBody } from 'semantic-ui-react'
import { GET_STAFF } from '../../queries/staffQuery'

const Profile = ({ id }) => {
  const staff =  JSON.parse(sessionStorage.getItem('staffKey'))
  let staffId = staff.id
  if(id){
    staffId= id
  }

  const { loading,error,data } = useQuery(GET_STAFF,{ variables:{ id:staffId } })

  if (loading) {
    return (
      <Loader active>Fetching User Profile</Loader>
    )
  }

  if (error) {
    console.log(error)
    return (
      <Header as ='h5'>Something Went Wrong, Please try again</Header>
    )
  }

  return (
    <Grid centered columns='3' >
      <Grid.Row  textAlign='center'> <Header as='h3'> {data && data.getStaff.name} </Header></Grid.Row>
      <Grid.Row centered  textAlign='center'>
        <Grid.Column>
          <Header as ='h4'>Basic Info</Header>
          <Table compact>
            <TableBody>
              <Table.Row>
                <Table.Cell width='8'> <strong> Id Card Registered </strong> </Table.Cell>
                <Table.Cell width='7'>{data.getStaff.idCardCode ?
                  <Icon name='checkmark' color='green'></Icon> : <Icon name='cancel' color='red'></Icon> }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Email </strong> </Table.Cell>
                <Table.Cell > {data.getStaff.email}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Username </strong> </Table.Cell>
                <Table.Cell> {data.getStaff.username}</Table.Cell>
              </Table.Row>
            </TableBody>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell >
                  <Button
                    primary
                    size='small'
                  >
                 Scan Id Card
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell >
                  <Button

                    primary
                    size='small'
                  >
                  Reset Password
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>

          </Table>
        </Grid.Column>
        <Grid.Column>
          <Header as ='h4'>Contract</Header>
          <Table compact>
            <TableBody>
              <Table.Row>
                <Table.Cell> <strong> Type </strong> </Table.Cell>
                <Table.Cell>{data && data.getStaff.contractType }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Required Hrs/Day </strong> </Table.Cell>
                <Table.Cell > {data && data.getStaff.reqHours}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Position </strong> </Table.Cell>
                <Table.Cell> {data && data.getStaff.position}</Table.Cell>
              </Table.Row>
            </TableBody>
            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell >
                  <Button
                    primary
                    size='small'
                  >
                 Edit Contract
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>

          </Table>
        </Grid.Column>
        <Grid.Column>
          <Header as ='h4'>Last Active</Header>
          <Table compact>
            <TableBody>
              <Table.Row>
                <Table.Cell> <strong> Station </strong> </Table.Cell>
                <Table.Cell>{ data && data.getStaff.currentStation &&  data.getStaff.currentStation.locatio }</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> <strong> Active at </strong> </Table.Cell>
                <Table.Cell > {data && data.getStaff.lastActive}</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell> </Table.Cell>
                <Table.Cell> </Table.Cell>
              </Table.Row>
            </TableBody>

          </Table>
        </Grid.Column>

      </Grid.Row>
    </Grid>

  )
}

export default Profile