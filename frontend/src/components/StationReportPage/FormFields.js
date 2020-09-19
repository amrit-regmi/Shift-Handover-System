import React from 'react'
import { useField, useFormikContext } from 'formik'
import { DateTimeInput } from 'semantic-ui-calendar-react'
import { Form, Button, Label, Segment, Checkbox } from 'semantic-ui-react'

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

export const UserInputFields = ({ disabled,...props }) => {
  const [field, meta] = useField(props)
  console.log({ ...props })
  const { setFieldValue,setFieldTouched } = useFormikContext()
  return(<Segment  >

    <Form.Group >

      <Form.Input name={field.name+'.name'}  {...props} placeholder="Staff name"/>

      <Form.Field>
        <DateTimeInput
          disabled = {disabled}
          placeholder = 'Start Time'
          name={field.name+'.startTime'}
          dateTimeFormat= 'YYYY-MM-DD HH:mm'
          popupPosition='right center'
          closable clearable
          onBlur= {() => {
            setFieldTouched(field.name+'.startTime',true)
          }}
          onChange={(event,{ value }) => {
            setFieldValue(field.name+'.startTime', value)
            console.log(value)
          }}
          preserveViewMode={false}/>

      </Form.Field>
      <Form.Field>
        <DateTimeInput
          disabled = {disabled}
          placeholder = 'End Time'
          name={field.name+'.endTime'}
          dateTimeFormat= 'YYYY-MM-DD HH:mm'
          popupPosition='right center' closable clearable
          onBlur= {() => {
            setFieldTouched(field.name+'.endTime',true)
          }}
          onChange={(event,{ value }) => {
            setFieldValue(field.name+'.endTime',  value)

          }}
          preserveViewMode={false}/>

      </Form.Field>

      <Button {...props} circular icon='cancel' basic></Button>
      {props.disabled?<>
        <Button inverted color='red' size="small"> Change</Button>
        <Label attached='top left' size='mini' basic color="grey" >Signed Off </Label>
      </>: <Button  inverted  {...props} primary>Sign Off</Button> }



      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}

    </Form.Group>
  </Segment>)



}

export const AircraftCheckBox = ({ label,children,checked,...props }) => {
  return  <Segment style= {{ display:checked?'block':'inline-block',marginRight:'20px',marginBottom:'20px'  }}> <Checkbox checked={checked} {...props} toggle/> <label style={{     display: 'inline-block' , marginLeft: '5px', verticalAlign: 'super' }}> {label.toUpperCase()} </label> {children}</Segment>}

export default DateInputFiled