import React ,{ useState }from 'react'
import { useField, useFormikContext } from 'formik'
import { DateTimeInput } from 'semantic-ui-calendar-react'
import { Form, Button, Label, Segment, Checkbox, TextArea, Divider, Icon } from 'semantic-ui-react'


export const DateInputFiled = ({ label,...props }) => {
  const { setFieldValue,setFieldTouched } = useFormikContext()
  const [field, meta] = useField(props)

  return (
    <Form.Field>
      {label &&
      <label>{label }</label>
      }
      <DateTimeInput popupPosition='right center' {...field} {...props} dateTimeFormat= 'YYYY-MM-DD HH:mm' closable onBlur= {() => {
        setFieldTouched(field.name,true)
      }} onChange={(event,{ value }) => {
        setFieldValue(field.name, value)
      }}
      preserveViewMode={false}/>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </Form.Field>
  )

}


export const InputFiled = ({ label,...props }) => {
  const [field] = useField(props)
  return (
    <Form.Field>
      <Form.Input {...field} {...props} />
    </Form.Field>
  )

}


export const TaskDescriptionField = ({ label,onRemove,disabled,children,taskName, ...props }) => {
  const [field] = useField(props)
  const { setFieldValue,getFieldProps } = useFormikContext()

  const removeButtonClick = ( e ) => {
    e.preventDefault()
    onRemove()
  }

  const [noteFieldVisibile, setNoteFieldVisibile] = useState(false)

  const taskUpdateStatus = getFieldProps(`${taskName}.newUpdate.action`).value
  const taskStatus = getFieldProps(`${taskName}.status`).value
  const taskNotes =  getFieldProps(`${taskName}.newUpdate.note`).value
  const addNoteButtonClick = () => {
    if(noteFieldVisibile){
      setNoteFieldVisibile(false)
    }else{
      setNoteFieldVisibile(true)
    }

  }

  const actionButtonClick = (e,value) => {
    setFieldValue(`${taskName}.newUpdate.action`,value)

  }

  const undoButtonClick = () => {
    setFieldValue(`${taskName}.newUpdate.action`,'')
  }


  const TaskStatusBar = () => {

    if( taskUpdateStatus ){
      return (
        <div style={{ padding:'5px 20px' }}>
          <Label  size='mini' basic >Task from previous shifts </Label>

          {taskNotes && taskNotes.trim() && <Label size='mini' basic color="blue" >Notes Added </Label>}
          <Label size='mini' basic color="green" >{taskUpdateStatus} </Label>

          <Label as="a" size='mini' basic color='yellow'
            onClick = {(e) => undoButtonClick(e)}> <Icon name='undo'/> Undo Action </Label>
        </div>)
    }
    return (
      <div style={{ padding:'5px 20px' }}>
        <Label  size='mini' basic >Task from previous shifts </Label>

        {taskNotes && taskNotes.trim() && <Label size='mini' basic color="blue" >Notes Added </Label>}
        <Label  size='mini' basic color="red" >Open </Label>

        {disabled && taskStatus === 'DEFERRED' &&
        <Label size='mini' basic color="red" >Action Required </Label>}
      </div>)


  }


  return(
    <>
      <Divider></Divider>
      {disabled &&
       <TaskStatusBar></TaskStatusBar>
      }
      <Form.Group>
        <label style={{ display: 'inline-block', padding: '15px 0px 0px 5px', width:'25px' }}>{label+1}</label>

        <TextArea rows="2" disabled={disabled}{...field} {...props}></TextArea>



        <Button
          circular
          icon='cancel'
          style= {{ visibility: disabled?'hidden':'', margin:'10px' }}
          basic
          onClick = {(e) => removeButtonClick(e)}/>

      </Form.Group>

      {!disabled &&
      <div style={{ padding:'0px 20px' }}>
        <Form.Group>
          <Form.Checkbox
            checked ={ taskStatus === 'DEFERRED'  || taskStatus === 'OPEN'}
            label="Is Open Task" onChange = {(e,{ checked }) => {
              e.preventDefault()
              if(checked){
                setFieldValue(`${taskName}.status`,'OPEN')
              }else{
                setFieldValue(`${taskName}.status`,'')
              }
            }}/>
          <Form.Checkbox
            label="Action Required"

            onChange = {(e,{ checked }) => {
              e.preventDefault()
              if(checked){
                setFieldValue(`${taskName}.status`,'DEFERRED')
              }else{
                setFieldValue(`${taskName}.status`,'OPEN')
              }
            }}/>
        </Form.Group>
      </div> }

      {disabled && !taskUpdateStatus &&
      <div style={{ margin:'0px 50px 10px 20px' }}>
        <Button size='mini'
          onClick = {(e) => addNoteButtonClick(e)}> {noteFieldVisibile?'Hide Notes' : taskNotes?'Show Notes':'Add Notes'}</Button>
        {noteFieldVisibile && children}
        <Button.Group size='mini'>
          <Button size='mini' positive
            value= 'Closed'
            onClick = {(e,{ value }) => actionButtonClick(e,value)}>Close Task</Button>

          <Button.Or size='mini' />
          <Button size='mini' negative
            value= 'Deffered'
            onClick = {(e,{ value }) => actionButtonClick(e,value)}> Defer Task to next Shift</Button>
        </Button.Group>
      </div> }


    </>
  )

}

export const AircraftCheckBox = ({ label,children,checked,...props }) => {
  return(
    <Segment
      style= {{ display:checked?'block':'inline-block',marginRight:'20px',marginBottom:'20px'  }}>
      <Checkbox checked={checked} {...props} toggle/>
      <label style={{ display: 'inline-block' , marginLeft: '5px', verticalAlign: 'super' }}> {label.toUpperCase()} </label>
      {children}
    </Segment>
  )}

export const TextAreaField = ({ label,...props }) => {
  const [field] = useField(props)
  return (
    <Form.Field>
      <Form.TextArea {...field} {...props} />
    </Form.Field>
  )}

export default DateInputFiled