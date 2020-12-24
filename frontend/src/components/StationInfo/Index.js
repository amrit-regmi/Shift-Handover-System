import { useQuery } from '@apollo/client'
import React, { Fragment, useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Button, Card, Flag, Grid, Header, Icon, Loader, Segment, Table } from 'semantic-ui-react'
import { GET_STATION } from '../../queries/stationQuery'
import { formatDate } from '../../utils/DateHelper'
import CostumerInfo from '../CostumerInfo'
import AssignCostumersModal from './AssignCostumersModal'
import Settings from './Settings'
import StationMenu from './stationMenu'

const StationInfo = (props) => {
  const [stationData, setStationData] = useState('')
  const [activeItem,setActiveItem] = useState('BasicInfo')
  const [activeCostumer,setActiveCostumer] = useState('')
  const [assignCostumerModalOpen, setAssignCostumerModalOpen] = useState(false)
  const history = useHistory()
  const location = useLocation()
  const locationPaths = location.pathname && location.pathname.split('/').filter(path => path)

  const params = useParams()

  useEffect(() => {
    if(params.page){
      setActiveItem(params.page)
    }
  },[params])

  let stationId = useParams().stationId

  /** If stationId is passed as props then passed stationId should have precedence over params */
  if(props.stationId){
    stationId = props.stationId
  }

  const loggedInStaff = JSON.parse( sessionStorage.getItem('staffKey'))

  const { loading,data } = useQuery(GET_STATION, {
    variables: { id: stationId },
    skip: !stationId,
  })

  useEffect (() => {
    if(data) {
      setStationData(data.getStation)
    }
  },[data])

  /**Gets bredcrumb item link
   * @param {Int} index - indexNumber of current item on fullpath
   */
  const getBreadCrumbLink = (index) => {
    const arr = [...locationPaths]
    const link = arr.reduce((p,c,i) => {
      if(i > index){ // stop at current page
        arr.splice(1)
        return p
      }
      return p+'/'+c
    },'')

    return link

  }

  if(!stationId || !stationData || loading ){
    return(
      <Segment basic>
        <Loader active>Loading Station</Loader>
      </Segment>
    )

  }

  return (
    <>
      { loggedInStaff &&
        <Breadcrumb>
          {locationPaths.map((path,index) => {
            if(index === 0) { //Skip for base page
              return ''
            }
            return (
              <Fragment key={index}>
                <BreadcrumbSection
                  active= {index === locationPaths.length-1  }
                  as={index < locationPaths.length-1?Link:''} //as Link previous Page
                  to ={ getBreadCrumbLink(index)}
                >
                  {index===2 && stationData.location}
                  {index===4 && locationPaths[index-1].toLowerCase() === 'costumers' && //If the path is costumerId then display costumer name else it must be procedure, display procdure id
                 stationData.costumers.filter(costumer => costumer.id === path)[0] && stationData.costumers.filter(costumer => costumer.id === path)[0].name
                  }
                  {
                    index !== 2 && index !== 4 &&
                  path
                  }

                </BreadcrumbSection>
                { index < locationPaths.length-1 &&
              <BreadcrumbDivider></BreadcrumbDivider>}
              </Fragment>
            )
          })}
        </Breadcrumb>
      }

      <StationMenu station= {stationData} activeItem ={activeItem} setActiveItem= {setActiveItem} setActiveCostumer ={setActiveCostumer}> </StationMenu>
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
                        loggedInStaff && loggedInStaff.permission.staff.view?
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

      {activeItem === 'Costumers' && ! (params.costumerId || activeCostumer) &&
      <>
        <Card.Group>
          {stationData.costumers && stationData.costumers.map(costumer =>
            <Card key={costumer.id} link raised
              onClick = {() => {
                if(loggedInStaff){
                  history.push(`${location.pathname}/${costumer.id}`)
                }else{
                  setActiveCostumer(costumer.id)
                }

              }}>
              <Card.Content textAlign='center' header = {costumer.name} />
              <Card.Content textAlign='center' >{costumer.contract? costumer.contract + ' Contract':''}</Card.Content>
              <Card.Content textAlign='center' extra>
                <Header as ='h5'> <Icon name='plane'/> Total Aircrafts: {costumer.aircrafts.length}</Header>
              </Card.Content>
            </Card>)}
        </Card.Group>
        {loggedInStaff && (loggedInStaff.permission.admin || loggedInStaff.permission.station.edit.map(station => station._id).includes(stationId)) &&
        <Segment basic compact>
          <Button primary icon onClick = {() => setAssignCostumerModalOpen(true)}>
            <Icon name='add circle' /> Add More
          </Button>
          {assignCostumerModalOpen &&
          <AssignCostumersModal open={assignCostumerModalOpen} setOpen={setAssignCostumerModalOpen} station={stationData}></AssignCostumersModal>
          }


        </Segment>}
      </>

      }

      {activeItem === 'Costumers' && (params.costumerId || activeCostumer) &&
       <CostumerInfo costumerId = {activeCostumer}></CostumerInfo>
      }

      {activeItem === 'Settings' &&
      <Settings data={stationData}></Settings>
      /**<Header as='h5'> This Station Settings feature is not Implemented yet, will be implemanted soon ...
        <Header.Subheader>
          After this implemetation, one will be able to change station settings such as 'SignIn/Off Work Methods', 'Add Remove Shifts', 'Number of active reporting', 'Change Station Key'
        </Header.Subheader>
      </Header>*/}
    </>
  )


}
export default StationInfo