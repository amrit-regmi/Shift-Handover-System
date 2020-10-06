import React from 'react'
import { Segment, Header, SegmentGroup } from 'semantic-ui-react'
import TaskInfo from './TaskInfo'
import  _ from  'lodash'

const GenericTaskPanel = ({ genericTasks,handoverId }) => {
  if(genericTasks.legth === 0){
    return null
  }
  return (
    <>
      <Segment stacked>

        <Header color = "blue" as="h4" block> {genericTasks[0].taskCategory} </Header>

        <SegmentGroup >
          { _.map(genericTasks,task =>
            <TaskInfo key={task.id} task ={task} handoverId = {handoverId}/>
          )}

        </SegmentGroup>
      </Segment>


    </>

  )
}

export default  GenericTaskPanel