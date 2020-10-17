import React, { useState } from 'react'
import { Label, Form, Button, Segment } from 'semantic-ui-react'
import { InputField, DateInputField } from './FormFields'
import { Field } from 'formik'
import { formatDate, operateDate } from '../../../utils/DateHelper'
import StaffEditModel from './StaffEditModel'

const StaffForm = ({ staff,fieldName,values,index,remove }) => {
  const [open, setOpen] = useState(false)
  const [removeStaff, setRemoveStaff] = useState(false)

  if(!staff) return null
  return(
    <Segment >
      {staff.signOffKey &&
      <Label attached='top left' size='mini' basic color="grey" >Signed Off </Label> }
      <Form.Group  >
        <InputField  width= {4} readOnly = {staff.signOffKey } name={`${fieldName}.name`}></InputField>
        < DateInputField
          readOnly = {(staff.signOffKey && !staff.changing) }
          maxDate = {operateDate(Date.now(),30,'m','sub')}
          minDate= {operateDate(Date.now(),20,'h','sub')}
          name = {`${fieldName}.startTime`}/>

        < DateInputField
          readOnly= {(staff.signOffKey  && !staff.changing) }
          maxDate = {formatDate(Date.now())}
          minDate= {operateDate(values.startTime,20,'m','add')}
          name = {`${fieldName}.endTime`}/>

        <Field type='hidden' value="" name={`${fieldName}.signOffKey`}></Field>
        <Field type='hidden' value="" name={`${fieldName}.break`}></Field>

        <Button
          style={{ height:'fit-content' }}
          type='button'
          circular
          icon='cancel'
          basic
          onClick = {() => {
            setRemoveStaff(true)
            setOpen(true)
          }}
        />


        <>
          <Button
            style={{ height:'fit-content' }}
            type='button'
            inverted
            color='red'
            size="small"
            onClick = {() => {
              setOpen(true)
            }
            }> Change</Button>
        </>

      </Form.Group>

      <StaffEditModel
        setOpen={setOpen}
        open={open}
        startTime ={values.staffs[index].startTime}
        endTime ={values.staffs[index].endTime}
        breakt = {values.staffs[index].break}
        fieldName = {fieldName}
        removeStaff = {removeStaff}
        setRemoveStaff= {setRemoveStaff}
        removeClick = {() => remove(index)}
      />

    </Segment>
  )}

export default StaffForm