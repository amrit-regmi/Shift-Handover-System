import React from 'react'
import { Segment,Label,Icon } from 'semantic-ui-react'
import _ from 'lodash'

const TaskInfo = ({ task }) => {
  return (
    <Segment >
      {task.status ==='DEFERRED' &&
      <> <Label color='red'size='mini' basic> Open </Label><Label color='red'size='mini' basic> Action Required </Label></>
      }
      {
        /**If more than one task update than this task is older deferred task that was completed on last shift */
      task.updates?.length > 1 &&task.status ==='CLOSED' &&
      <> <Label  size='mini' basic >Task from previous shifts </Label> <Label color='green' size='mini' basic> Completed </Label></>
      }
      {
        /**If open task and some action was performed on the last shift */
        task.status ==='OPEN' && _.find(task.updates, ['handoverId',''] ) &&
      <Label color='pink'size='mini' basic> Open </Label>
      }
      {
      task.updates?.length > 1 &&
      <Label as="a" size='mini' > <Icon name ="history"/> Action History   </Label>
      }

      <Segment style= {{ 'paddingTop': 0,'paddingLeft': 0 }}basic compact>{task.description}   </Segment>
    </Segment>)
}

export default TaskInfo