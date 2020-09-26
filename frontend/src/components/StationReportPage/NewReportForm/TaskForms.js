import React from 'react'
import { FieldArray } from 'formik'
import TaskForm from './TaskForm'
import { Button, Icon } from 'semantic-ui-react'


const TaskForms = ({ tasksIdentifier,tasks,taskCategory,onRemove,aircraftId }) => {

  const newTaskField = () => {
    const newTaskField = { description:'',status:'',action:'',taskCategory: tasksIdentifier }
    if(taskCategory && taskCategory === 'AIRCRAFT'){
      newTaskField.aircraft = aircraftId
      newTaskField.taskCategory = taskCategory
    }

    return newTaskField

  }

  return  <FieldArray name={`tasks.${tasksIdentifier}`}>
    {({ push,remove }) => (<>
      {tasks && tasks.map((task,index) =>
        <TaskForm key={index}
          label= {index}
          name={`tasks.${tasksIdentifier}.${index}`}
          //The input Field is disabled if the task is open or deferred from previous shifts implied by task.id field
          disabled = {task.id && (task.status === 'DEFERRED' || task.status==='OPEN')}
          onRemove = {
            () => {
              if(onRemove) onRemove()
              remove(index)
            }
          }
        >
        </TaskForm>
      )}

      {/**
       * Add new row button
       */}
      <Button
        type='button'
        icon
        style={{ marginLeft:'10px' }}
        primary
        onClick={ (e) => push (newTaskField())
        }>
        <Icon name="plus circle"/> Add
      </Button>
    </>)}
  </FieldArray>}

export default TaskForms