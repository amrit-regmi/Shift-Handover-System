import React, { useState } from 'react'
import { Segment,Label,Icon } from 'semantic-ui-react'
import _ from 'lodash'
import TaskModal from './TaskModal'

const TaskInfo = ({ task , handoverId }) => {
  const [openDetail, setOpenDetail] = useState(false)
  const updateOnthisHandover = _.find(task.updates, ['handoverId',{ 'id':handoverId }] )
  return (<>
    <Segment >
      {
        !updateOnthisHandover.action.includes('TASK_CREATED') &&
        <Label  size='mini' basic>Tasks from previous shifts</Label>
      }
      {/*
        updateOnthisHandover.action.includes('TASK_CREATED') &&
        <Label circular size='mini' color = 'teal' basic>New</Label>*/
      }

      {
        (updateOnthisHandover.action ==='DEFERRED' ||  updateOnthisHandover.action ==='TASK_CREATED_DEFERRED')&&
        <><Label size='mini' color='red' basic> Deferred </Label>
          <Label color='red'size='mini' basic> Action Required </Label>
        </>
      }
      {
        /**If task is  not created on last report this task is older open task that was completed on last shift */
        updateOnthisHandover.action ==='CLOSED' &&
       <Label color='green' size='mini' basic> Completed </Label>
      }
      {
        /**If open task and some action was performed on the last shift */
        task.status ==='OPEN' && updateOnthisHandover &&
        <>{
          !updateOnthisHandover.action.includes('TASK_CREATED') &&
          <Label size='mini' basic> {updateOnthisHandover.action} </Label>
        }
        <Label color='purple'size='mini' basic> Open </Label></>
      }

      { /** If task is not new then show toggle update history button */
        !updateOnthisHandover.action.includes('TASK_CREATED') && task.updates.length > 1 &&
      <Label as="a" size='mini' onClick = {() => {
        setOpenDetail(true)
      }}> <Icon name ="history"/> Action History   </Label>
      }

      <Segment style= {{ 'paddingTop': 0,'paddingLeft': 0 }}basic compact>{task.description}   </Segment>


    </Segment>
    { openDetail &&
      <TaskModal open= {openDetail} setOpen = {setOpenDetail} task= {task} viewingOnHanodover = {handoverId}> </TaskModal>
    }
  </>)
}

export default TaskInfo