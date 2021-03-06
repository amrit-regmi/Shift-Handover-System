import React from 'react'
import { Form, Input, Dropdown, Segment, Header, List, Label } from 'semantic-ui-react'
import { TextAreaField } from '../StationReportPage/NewReportForm/FormFields'
import { useField, useFormikContext } from 'formik'
import _ from 'lodash'

export const InputField = ({ ...props }) => {
  const [field, meta] = useField(props)
  return (
    <Form.Field>
      <label>{props.inputlabel }</label>
      <Input  {...field} {...props}  error= {meta.touched && meta.error} />
    </Form.Field>
  )

}


export const RemarkField = ({ name }) => {
  const { getFieldProps } = useFormikContext()
  const remarkTitle = getFieldProps(`${name}.title`).value
  const remarkDate = getFieldProps(`${name}.date`).value
  const remarkBy = getFieldProps(`${name}.by`).value
  const remarkText = getFieldProps(`${name}.text`).value
  const remarkEdit = getFieldProps(`${name}.edit`).value

  if (!remarkTitle || remarkTitle === 'Add Clearification')
  {
    return (
      <Segment basic>
        {remarkTitle &&
        <Header as ='h5'>
          {remarkTitle === 'Add Clearification'&& 'Clearification Added' }
          <Header.Subheader>by {remarkBy} on {remarkDate}</Header.Subheader>
        </Header>
        }
        <TextAreaField name={`${name}.text`}></TextAreaField>
      </Segment>
    )
  }

  return (
    <Segment>
      <Header as ='h5'>
        {remarkTitle}
        <Header.Subheader>by {remarkBy} on {remarkDate}</Header.Subheader>
      </Header>
      {remarkTitle && <p>{remarkText}</p>}
      {remarkEdit && <List>
        {_.map(remarkEdit,(val,k) =>
          <List.Item key={k}>
            {k[0].toUpperCase() + k.substring(1).replace(/([a-z])([A-Z])/g, '$1 $2')}:
            <span style={{ color:'red',fontStyle: 'italic', textDecoration: 'line-through' }}> {val.split('to')[0]} </span>
            to
            <span style={{ color:'green' }}> {val.split('to')[1]} </span>
          </List.Item> )}

      </List> }

    </Segment>
  )

}

export const DropDownField = ({ label,...props }) => {
  const{ setFieldValue }= useFormikContext()
  const [field,meta] = useField(props)
  return (
    <Form.Field error= { meta.touched && meta.error?true:false}>
      {!props.labeled && <label>{label }</label>}
      <Input
        label= {props.labeled? label :false}
        input = {<Dropdown {...field} {...props}
          style= {
            props.labeled? { margin: 0,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0 }:{}
          }
          onChange = {props.onChange? props.onChange: (e,{ value }) => {
            setFieldValue(props.name,value)
          }}
        ></Dropdown>}></Input>
      {meta.touched && meta.error &&
      <Label pointing prompt>
        {meta.error}
      </Label>}
    </Form.Field>
  )

}