import React from 'react'
import { useField, useFormikContext } from 'formik'
import { DateTimeInput, TimeInput } from 'semantic-ui-calendar-react'
import { Form, Label, Segment, Checkbox, Input } from 'semantic-ui-react'


export const DateInputField = ({ label,...props }) => {
  const { setFieldValue,setFieldTouched } = useFormikContext()
  const [field, meta] = useField(props)

  return (
    <Form.Field width = '4' >
      {label &&
      <label>{label}</label>}

      <DateTimeInput  error = {meta.touched && meta.error?true:false} popupPosition='right center'  {...field} {...props} dateTimeFormat= 'DD-MM-YYYY HH:mm' closable onBlur= {() => {
        setFieldTouched(field.name,true)
      }} onChange={(event,{ value }) => {
        setFieldValue(field.name, value)
      }}
      preserveViewMode={false}/>

      {meta.touched && meta.error ?
        <Label pointing prompt>
          {meta.error}
        </Label>:''}
    </Form.Field>
  )

}

export const TimeInputField = ({ label,...props }) => {
  const { setFieldValue,setFieldTouched } = useFormikContext()
  const [field, meta] = useField(props)

  return (
    <Form.Field width = '4' >
      {label &&
      <label>{label}</label>}

      <TimeInput error = {meta.touched && meta.error?true:false} popupPosition='right center' {...field} {...props} closable onBlur= {() => {
        setFieldTouched(field.name,true)
      }} onChange={(event,{ value }) => {
        setFieldValue(field.name, value)
      }}
      />

      {meta.touched && meta.error ?
        <Label pointing prompt>
          {meta.error}
        </Label>:''}
    </Form.Field>
  )

}


export const InputField = ({ width,...props }) => {
  const [field,meta] = useField(props)
  return (
    <>
      <Form.Field error= { meta.touched && meta.error ? true: false} width={width} >
        <label>{props.inputlabel?props.inputlabel:'' }</label>
        <Input   {...field} {...props} />
        { props.type !== 'hidden' && meta.touched && meta.error &&
        <Label pointing prompt>
          {meta.error}
        </Label>
        }

      </Form.Field>

    </>
  )

}




export const AircraftCheckBox = ({ label,children,checked,...props }) => {
  return(
    <Segment
      style= {{ display:checked?'block':'inline-block'  }}>
      <Checkbox checked={checked} {...props} toggle/>
      <label style={{ display: 'inline-block' , marginLeft: '5px', verticalAlign: 'super' }}> {label.toUpperCase()} </label>
      {children}
    </Segment>
  )}

export const TextAreaField = ({ label,...props }) => {
  const [field,meta] = useField(props)
  return (
    <Form.TextArea  error = { meta.touched && meta.error} {...field} {...props}/>
  )}
