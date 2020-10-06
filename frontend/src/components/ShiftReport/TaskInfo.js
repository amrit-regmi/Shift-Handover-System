import React from 'react'
import { Segment,Label,Icon } from 'semantic-ui-react'
import _ from 'lodash'

const TaskInfo = ({ task , handoverId }) => {
  const updateOnthisHandover = _.find(task.updates, ['handoverId',{ 'id':handoverId }] )
  return (
    <Segment >
      {
        updateOnthisHandover.action !== 'TASK_CREATED' &&
        <Label  size='mini' basic>Tasks from previous shifts</Label>
      }
      {
        updateOnthisHandover.action === 'TASK_CREATED' &&
        <Label circular size='mini' color = 'teal' basic>New</Label>
      }

      {
        task.status ==='DEFERRED' &&
        <><Label size='mini' color='red' basic> Deferred </Label><Label color='red'size='mini' basic> Action Required </Label></>
      }
      {
        /**If task is  not created on last report this task is older open task that was completed on last shift */
        updateOnthisHandover.action !== 'TASK_CREATED' && task.status ==='CLOSED' &&
       <Label color='green' size='mini' basic> Completed </Label>
      }
      {
        /**If open task and some action was performed on the last shift */
        task.status ==='OPEN' && updateOnthisHandover &&
        <>{
          updateOnthisHandover.action !== 'TASK_CREATED' &&
          <Label size='mini' basic> {updateOnthisHandover.action} </Label>
        }
        <Label color='purple'size='mini' basic> Open </Label></>
      }

      { /** If task is not new then show toggle update history button */
        task.updates.length > 1 &&
      <Label as="a" size='mini' onClick = {() => {
        /**TO BE IMPLEMENTED  */
      }}> <Icon name ="history"/> Action History   </Label>
      }

      <Segment style= {{ 'paddingTop': 0,'paddingLeft': 0 }}basic compact>{task.description}   </Segment>
    </Segment>)
}

export default TaskInfo