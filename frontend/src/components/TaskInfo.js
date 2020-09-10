import React from 'react'
import {Segment,Label,Icon} from 'semantic-ui-react'

const TaskInfo = ({task}) => {
  return (
  <Segment >
    {task.status ==="OPEN" &&
      <Label color='red'size='mini'> Action Required </Label>
    }
    {
    task.status ==="CLOSED" &&
      <Label color='green'size='mini'> Completed </Label>
    }
    {
      task.updates?.length > 0 &&
      <Label as="a" size='mini' > <Icon name ="history"/> Action History   </Label>
    }
       
    <p>{task.description}   </p>
  </Segment>)
}

export default TaskInfo