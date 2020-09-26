import React, { Fragment } from 'react'
import { FieldArray, Field, useFormikContext } from 'formik'
import ErrorMessage from './ErrorMessage'
import { Segment, Label,Form, Button,Icon,Header } from 'semantic-ui-react'
import{ DateInputField,  InputField } from './FormFields'
import { operateDate, formatDate } from '../../../utils/DateHelper'

const StaffForm = ({ values, touched,errors }) => {
  const{ getFieldMeta,setFieldTouched } = useFormikContext()

  const signOff = async (index) => {
    setFieldTouched(`staffs[${index}].startTime`)
    setFieldTouched(`staffs[${index}].endTime`)
    setFieldTouched(`staffs[${index}].name`)

    if(getFieldMeta(`staffs[${index}].startTime`).error || getFieldMeta(`staffs[${index}].endTime`).error || getFieldMeta(`staffs[${index}].name`).error) {
      setFieldTouched(`staffs[${index}].signedOffKey`,true)
      console.log(getFieldMeta(`staffs[${index}].signedOffKey`))
      return false
    }

    const signOffKey = 'testingKey'
    return ({ key:signOffKey })

  }
  const save = () => {


  }

  const change = () => {

  }



  return (
    <FieldArray name="staffs">
      {({ remove, push, replace }) => (
        <Fragment >
          <Header as="h3">Staffs</Header>
          <Segment.Group >


            { values.staffs.length >0 && values.staffs.map((staff,index) =>
              <Segment  key= {index}>
                {staff.signedOffKey &&
                      <Label attached='top left' size='mini' basic color="grey" >Signed Off </Label> }
                <Form.Group  >
                  <InputField  disabled= {staff.signedOffKey? true:false } name={`staffs[${index}].name`}></InputField>
                  < DateInputField
                    disabled= {staff.signedOffKey && !staff.changing? true:false }
                    maxDate = {operateDate(Date.now(),30,'m','sub')}
                    minDate= {operateDate(Date.now(),20,'h','sub')}
                    name = {`staffs[${index}].startTime`}/>

                  < DateInputField
                    disabled= {staff.signedOffKey  && !staff.changing?  true:false }
                    maxDate = {formatDate(Date.now())}
                    minDate= {operateDate(values.startTime,20,'m','add')}
                    name = {`staffs[${index}].endTime`}/>

                  <Field type='hidden' value="" name={`staffs[${index}].signedOffKey`}></Field>

                  <Button
                    style={{ height:'fit-content' }}
                    type='button'
                    circular
                    icon='cancel'
                    basic
                    disabled = {staff.signedOffKey  && !staff.changing? true:false }
                    onClick = {() => {
                      remove(index)
                    }}
                  />

                  {staff.signedOffKey && !staff.changing &&
                      <>
                        <Button
                          style={{ height:'fit-content' }}
                          type='button'
                          inverted
                          color='red'
                          size="small"
                          onClick = {() => {
                            replace(index, { ...staff, changing: true })
                          }
                          }> Change</Button>
                      </> }


                  {staff.signedOffKey && staff.changing &&
                      <>
                        <Button
                          style={{ height:'fit-content' }}
                          type='button'
                          inverted
                          color='green'
                          size="small"
                          onClick = {() => {
                            setFieldTouched(`staffs[${index}].startTime`)
                            setFieldTouched(`staffs[${index}].endTime`)
                            setFieldTouched(`staffs[${index}].name`)
                            if(!getFieldMeta(`staffs[${index}]`).error) {
                              replace(index, { ...staff, changing: false })
                            }

                          }
                          }> Save </Button>

                      </> }


                  {!staff.signedOffKey &&
                      <Button
                        style={{ height:'fit-content' }}
                        color = {touched.staffs && touched.staffs[index] && touched.staffs[index].signedOffKey && errors.staffs && errors.staffs[index].signedOffKey?'red':'blue'}
                        type='button'
                        inverted
                        onClick = {async () => {
                          const signoff = await signOff(index)
                          if(signoff && signoff.key) {
                            replace(index, { ...staff, signedOffKey:'testKey' })
                          }
                        }
                        } > Sign Off </Button> }
                  <ErrorMessage pointing='left' name= {`staffs[${index}].signedOffKey`}/>

                </Form.Group>


              </Segment>
            )

            }
          </Segment.Group>
          <Button type='button' icon
            primary onClick={ () => push({ name:'',startTime:'',endTime:'' ,signedOffKey:'' })}>< Icon name="plus circle"/> Add </Button>  <ErrorMessage name='staffs' pointing='left'/>
        </Fragment>
      )}

    </FieldArray>

  )
}

export default StaffForm