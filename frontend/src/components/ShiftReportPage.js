import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import {GET_SHIFT_REPORT} from '../queries/shiftReportQuery'
import { useParams } from 'react-router-dom'
import { Loader,Image,Segment, Header, Button, Menu,SegmentGroup ,Table,Label, Icon} from 'semantic-ui-react'
import  _ from  'lodash'
import TaskInfo from './TaskInfo'
import AircraftTaskPanel from './AircraftTasksPanel'
import GenericTaskPanel from './GenericTasksPanel'


const ShiftReportPage = () => {
  const params = useParams()
  const id =params.id
  const station = params.station

  const [activeItem, setActiveItem] = useState('lastShiftReport')

  let queryParams
  if (station && id ){
     queryParams = {
     station: id,
     flag:"MOST_RECENTLY_COMPLETED"
   }
  }else{
    queryParams = {id:id}
    console.log('only id set')
  }

const {loading, error,data } = useQuery(GET_SHIFT_REPORT,{variables:queryParams})

const handleMenuClick = (e, { name }) => setActiveItem( name )


if (loading) {
  return (
    <Loader active>Fetching Data</Loader>
  )
}


if (error) return `Error! ${error}`;

const tasksByCat = _.groupBy(data.getShiftReport.tasks, task => task.taskCategory)
const tasks = _.mapValues(
  tasksByCat,(cat,k) => 
  k === "AIRCRAFT"?
    _.chain(tasksByCat.AIRCRAFT)
    .groupBy(taskcat  =>  taskcat.aircraft.costumer.name)
    .mapValues( costumer => {
      return(_.groupBy(costumer, task => task.aircraft.registration))
    })
    .value()
    :cat
   )

console.log(tasks)

return (
  <>
  <Segment  basic>
    <Image src='\LogoBig.png' size="medium" />
    <Header textAlign ="right" color ="blue"  dividing >Shift Reporting System </Header>     
  </Segment>
 
  <Menu inverted color="blue">
    <Menu.Item header>  Shift Reporting System </Menu.Item>
    <Menu.Item name= "lastShiftReport"
    active = {activeItem === 'lastShiftReport'}
    onClick = {handleMenuClick}></Menu.Item>
    <Menu.Item name= "browseAllReports"
    active = {activeItem === 'browseAllReports'}
    onClick = {handleMenuClick}></Menu.Item>
    <Menu.Item name= "startNewReport"
    active = {activeItem === 'startNewReport'}
    onClick = {handleMenuClick}></Menu.Item>
    <Menu.Menu position='right'>
            <Button primary
              name='Switch Station '
              active={activeItem === 'logout'}
              onClick={handleMenuClick}
            >Switch Station</Button>
          </Menu.Menu>
  </Menu>
  <SegmentGroup>
   <Segment basic clearing>
    <Header floated ="left"> Shift Report from {data.getShiftReport.shift} shift <span><h5>({data.getShiftReport.startTime.substring(10)} - {data.getShiftReport.endTime.substring(10)})</h5></span></Header>
    <Header floated ="right" as="h5">  {data.getShiftReport.startTime.substring(10,0)}<span><br/>Arlanda</span> </Header> 
   </Segment> 
   <Segment>
     <Table celled >
       <Table.Header>
         <Table.Row>
            <Table.HeaderCell>Staff</Table.HeaderCell>
            <Table.HeaderCell>Start Time</Table.HeaderCell>
            <Table.HeaderCell>End TIme</Table.HeaderCell>
         </Table.Row>
       </Table.Header>
       <Table.Body>
       {data.getShiftReport.staffAndTime.map(timesheet => 
         <Table.Row key={timesheet.id}>
           <Table.Cell>{timesheet.staff.name}</Table.Cell>
           <Table.Cell>{timesheet.startTime.substring(10)}</Table.Cell>
           <Table.Cell>{timesheet.endTime.substring(10)}</Table.Cell>
           </Table.Row>
       )}
       </Table.Body>

     </Table>

   </Segment>
  
        {_.map(tasks, (tasksByType,key_taskType)=>{
          if(key_taskType === "AIRCRAFT") return <AircraftTaskPanel key={key_taskType} aircraftTasks={ tasksByType}/>
          
         return ( <GenericTaskPanel key = {key_taskType} genericTasks= {tasksByType}/>)
        }
        )}
    
     
</SegmentGroup>
</>
)

}

export default (ShiftReportPage)

