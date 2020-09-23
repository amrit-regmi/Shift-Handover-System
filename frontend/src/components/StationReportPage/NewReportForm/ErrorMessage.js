import React from 'react'
import { Field, getIn } from 'formik'
import {  Label } from 'semantic-ui-react'

const ErrorMessage = ({ name,pointing }) => (
  <Field
    name={name}>
    {({ form }) => {

      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)
      return touch && error && typeof error === 'string' ?
        <Label pointing={pointing} style={{ height:'fit-content' }}color='red'  basic>{error}</Label> : null
    }}
  </Field>
)

export default ErrorMessage