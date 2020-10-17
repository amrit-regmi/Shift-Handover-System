import React from 'react'
import { useField, useFormikContext } from 'formik'
import { DateTimeInput } from 'semantic-ui-calendar-react'
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


export const InputField = ({ ...props }) => {
  const [field,meta] = useField(props)
  return (
    <>

      <Form.Field>
        <label>{props.inputlabel?props.inputlabel:props.label }</label>
        <Input   error= { props.type !== 'hidden' && meta.touched && meta.error} {...field} {...props} />
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
