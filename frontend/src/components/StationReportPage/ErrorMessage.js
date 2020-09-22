import React from 'react'
import { Field, getIn } from 'formik'
import { Message } from 'semantic-ui-react'

const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name)
      const touch = getIn(form.touched, name)

      return touch && error && typeof error === 'string' ? <Message error visible>{error}</Message> : null
    }}
  />
)

export default ErrorMessage