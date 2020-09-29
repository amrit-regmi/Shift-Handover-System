import React, { Fragment } from 'react'
import { FieldArray } from 'formik'
import ErrorMessage from './ErrorMessage'
import { Segment, Button,Icon,Header } from 'semantic-ui-react'
import StaffForm from './StaffForm'

const StaffForms = ({ values ,addStaffOpen }) => {

  return (
    <>
      <FieldArray name="staffs">
        {({ remove, push, replace }) => (
          <Fragment >
            <Header as="h3">Staffs</Header>
            <Segment.Group >
              { values.staffs.length >0 && values.staffs.map((staff,index) =>
                <StaffForm
                  key={index}
                  index ={index}
                  staff={staff}
                  fieldName={`staffs.${index}`}
                  values= {values}
                  remove= {remove}
                ></StaffForm>
              )
              }
            </Segment.Group>
            <Button type='button' icon
              primary onClick={ () =>
                addStaffOpen(true)
                /*push({ name:'',startTime:'',endTime:'' ,signedOffKey:'' })*/}>< Icon name="plus circle"/> Add </Button>  <ErrorMessage name='staffs' pointing='left'/>
          </Fragment>
        )}

      </FieldArray>

    </>

  )
}

export default StaffForms