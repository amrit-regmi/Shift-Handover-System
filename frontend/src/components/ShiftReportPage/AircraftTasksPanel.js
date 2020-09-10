import React from 'react'
import { Segment, Header, SegmentGroup ,Icon } from 'semantic-ui-react'
import TaskInfo from '../TaskInfo'
import  _ from  'lodash'

const AircraftTaskPanel = ({ aircraftTasks }) => {
  if(aircraftTasks.legth === 0){
    return null
  }
  return (

    <Segment stacked>
      {_.map(aircraftTasks,(aircrafts,key_costumerName) =>
        <SegmentGroup   key ={key_costumerName}>

          <Header color = "blue" as="h4" block  > <Icon name = 'plane'/> Work Performed for {key_costumerName}</Header>


          { _.map(aircrafts,((tasks,key_aircraft) =>
            <SegmentGroup key={key_aircraft}>
              <Segment  >
                {key_aircraft}
              </Segment>
              {_.map(tasks,task =>
                <TaskInfo key={task.id} task ={task}/>
              )}

            </SegmentGroup>))
          }

        </SegmentGroup>



      )
      }</Segment>
  )
}

export default AircraftTaskPanel