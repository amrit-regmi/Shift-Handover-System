import React, { useState } from 'react'
import { useFormikContext } from 'formik'
import { Label, Icon, Divider,Form,Button,Accordion } from 'semantic-ui-react'
import ErrorMessage from './ErrorMessage'
import { TextAreaField } from './FormFields'


export const TaskForm = ({ label,onRemove,disabled,children,name, ...props }) => {
  const { setFieldValue,getFieldProps,setFieldTouched, getFieldMeta } = useFormikContext()

  const removeButtonClick = ( e ) => {
    e.preventDefault()
    onRemove()
  }

  const [noteFieldVisibile, setNoteFieldVisibile] = useState(false)

  const taskUpdateStatus = getFieldProps(`${name}.action`).value
  const taskStatus = getFieldProps(`${name}.status`).value
  const taskNotes =  getFieldProps(`${name}.newNote`).value

  const actionButtonClick = (e,value) => {
    e.preventDefault()
    setFieldValue(`${name}.action`,value)
    if(noteFieldVisibile && !taskNotes){
      toggleNotes()
    }
  }

  const actionOpenCheckBoxClick = (e,checked) => {
    setFieldTouched(`${name}.description`,true)
    if(!getFieldMeta(`${name}.description`).error){

      if(checked){

        setFieldValue(`${name}.action`,'OPEN')

      }else{
        setFieldValue(`${name}.action`,'')
      }
    }
    else{
      setFieldTouched(`${name}.description`)
    }
  }

  const actionDeferCheckBoxClick = (e,checked) => {
    setFieldTouched(`${name}.description`,true)
    if(!getFieldMeta(`${name}.description`).error){
      if(checked){
        setFieldValue(`${name}.action`,'DEFERRED')
      }else{
        setFieldValue(`${name}.action`,'OPEN')
      }
    }
    else{
      setFieldTouched(`${name}.description`)
    }


  }

  const undoButtonClick = () => {
    setFieldValue(`${name}.action`,'')
    if(taskNotes) {
      setNoteFieldVisibile(true)
    }
  }

  const toggleNotes = () => {
    if(noteFieldVisibile){
      const notes= taskNotes.trim()
      setNoteFieldVisibile(false)
      setFieldValue(`${name}.newNote`,notes)
    }else{
      setNoteFieldVisibile(true)
    }

  }

  const TaskStatusBar = () => {

    if( taskUpdateStatus ){
      return (
        <div style={{ padding:'0.3125em 1.5em' }}>
          <Label  size='mini' basic >Task from previous shifts </Label>

          {taskNotes && taskNotes.trim() && <Label size='mini' basic color="blue" as='a' onClick = {() => toggleNotes() }>Notes Added </Label>}
          <Label size='mini' basic color="green" >{taskUpdateStatus} </Label>

          <Label as="a" size='mini' basic color='yellow'
            onClick = {(e) => undoButtonClick(e)}> <Icon name='undo'/> Undo Action </Label>

        </div>)
    }

    return (
      <div style={{ padding:'0.3125em 1.5em' }}>
        <Label  size='mini' basic >Task from previous shifts </Label>

        {taskNotes && taskNotes.trim() && <Label size='mini' basic color="blue" >Notes Added </Label>}
        <Label  size='mini' basic color="purple" >Open </Label>

        {disabled && taskStatus === 'DEFERRED' &&
        <Label size='mini' basic color="red" >Action Required </Label>}
      </div>)


  }




  const rootPanels = [
    { key: 'panel-1', title: 'Updates', content: 'These are updates' },
  ]


  return(
    <>
      <Divider></Divider>
      {disabled &&
       <TaskStatusBar></TaskStatusBar>
      }

      <Form.Group style={{ marginBottom:'0px' }}>

        <label style={{ display: 'inline-block', padding: '0.9375em 0px 0px 0.3125em', width:'1.5625em' }}>{label+1}</label>

        <TextAreaField name= {`${name}.description`} disabled={disabled} rows ='1' width='16'></TextAreaField>



        <Button
          type='button'
          circular
          icon='cancel'
          style= {{ visibility: disabled?'hidden':'',height:'fit-content' }}
          basic
          onClick = {(e) => removeButtonClick(e)}/>



      </Form.Group>

      {!disabled &&
      <div style={{ padding:'0.5em 1.5em' }}>
        <Form.Group>
          <Form.Checkbox
            checked ={ taskUpdateStatus === 'DEFERRED'  || taskUpdateStatus === 'OPEN'}
            label="Is Open Task" onChange = {(e,{ checked }) => actionOpenCheckBoxClick(e,checked)}/>
          <Form.Checkbox
            label="Action Required"
            checked= {taskUpdateStatus === 'DEFERRED' }
            onChange = {(e,{ checked }) => actionDeferCheckBoxClick (e,checked) }/>
        </Form.Group>

      </div> }

      {disabled && !taskUpdateStatus &&


      <div style={{ margin:'0px 3.125em 0.625em 1.5em' }}>
        <Accordion  panels={rootPanels} />
        <ErrorMessage name = {`${name}.action`} pointing='below' ></ErrorMessage>
        <div>
          <Button size='mini'
            type='button'
            onClick = {(e) => toggleNotes(e)}> {noteFieldVisibile?'Hide Notes' : taskNotes?'Show Notes':'Add Notes'}</Button>
          <Button.Group size='mini'>
            <Button type='button'
              size='mini' positive
              value= 'CLOSED'
              onClick = {(e,{ value }) => actionButtonClick(e,value)}>Close Task</Button>

            <Button.Or size='mini' />
            <Button  type='button'
              size='mini' negative
              value= 'Deferred'
              onClick = {(e,{ value }) => actionButtonClick(e,value)}> Defer Task to next Shift</Button>
          </Button.Group>
        </div>
      </div>


      }
      <TextAreaField rows='1' disabled = {!!taskUpdateStatus} hidden= {!noteFieldVisibile} style= {{ paddingBotton:'0.3125em',margin:'0px 3.125em 0.625em 1.5em'  }} name={`${name}.newNote`  }width='14'/>


    </>
  )

}

export default TaskForm