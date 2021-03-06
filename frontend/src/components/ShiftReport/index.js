import React from 'react'
import GenericTaskPanel from './GenericTasksPanel'
import AircraftTaskPanel from './AircraftTasksPanel'
import { SegmentGroup, Segment, Header } from 'semantic-ui-react'
import _ from 'lodash'
import StaffWorkTime from './StaffWorkTime'


const ShiftReport = ({ reportData }) => {

  if(!reportData){
    return<Segment>No reports found</Segment>
  }
  const tasksByCat = _.groupBy(reportData.tasks, task => task.taskCategory)
  const tasks = _.mapValues(
    tasksByCat,(cat,k) =>
      k === 'AIRCRAFT'?
        _.chain(tasksByCat.AIRCRAFT)
          .groupBy(taskcat  =>  taskcat.aircraft.costumer.name)
          .mapValues( costumer => {
            return(_.groupBy(costumer, task => task.aircraft.registration))
          })
          .value()
        :cat
  )


  return (
    <SegmentGroup>
      <Segment basic clearing>
        <Header floated ="left"> Shift Report from {reportData.shift} shift <span><h5>({reportData.startTime.substring(10)} - {reportData.endTime.substring(10)})</h5></span></Header>
        <Header floated ="right" as="h5">  {reportData.startTime.substring(10,0)}<span><br/>{reportData.station.location}</span> </Header>
      </Segment>

      <StaffWorkTime timesheets = {reportData.staffAndTime} />

      {_.map(tasks, (tasksByType,key_taskType) => {
        if(key_taskType === 'AIRCRAFT') return (
          <AircraftTaskPanel key={key_taskType} aircraftTasks={ tasksByType} handoverId= {reportData.id}/>

        )

        return (
          <GenericTaskPanel key = {key_taskType} genericTasks= {tasksByType} handoverId= {reportData.id}/>
        )
      }
      )}


    </SegmentGroup>
  )
}

export default ShiftReport