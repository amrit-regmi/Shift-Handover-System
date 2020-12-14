import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useContext, useEffect } from 'react'
import { Button, Dimmer, Form, Grid, Icon, List, Loader, Modal,ModalContent, ModalHeader, Segment } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { STAFF_ADD } from '../../mutations/staffMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { validateEmail, validateName } from '../StationReportPage/NewReportForm/validator'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
const NewStaffModel = (props) => {
  const [,dispatch]= useContext(NotificationContext)

  const [addStaffMutation,{ loading,error }] = useMutation(STAFF_ADD)

  const addStaff = (values) => {
    addStaffMutation({
      variables: values,
      update: (store,response) => {
        store.modify({
          fields:{
            allStaff(existingStaffRefs , { readField }){
              const newStaff = response.data.addStaff
              if(existingStaffRefs.some(ref => readField('id',ref) === newStaff.id)){
                return existingStaffRefs
              }
              return [...existingStaffRefs,newStaff]

            }
          }

        })
      }
    }).then(
      res =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, new staff ${values.name} created` ,type: 'SUCCESS' } }),
      err =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{`Error, Cannot create new staff  staff ${values.name}`}<br/> {err.message}</> ,type: 'ERROR' } }),
      props.setOpen(false)
    )

  }
  const initVal = {
    name: '',
    email: '',
    phone: '',
    contractType: '',
    contractHours: '',
    position: '',
  }
  return(
    <Formik
      initialValues = { initVal }
      onSubmit= {(values) => {
        addStaff(values)
      }}
      validate = {(values) => {
        let errors = {}

        errors.name = validateName(values.name)
        errors.email = validateEmail(values.email)

        if(_.isEmpty(errors.name)) delete errors.name
        if(_.isEmpty(errors.email)) delete errors.email

        if(!values.contractType ){
          errors.contractType = 'Please select contract type'
        }

        if(!values.contractHours || !parseFloat(values.contractHours) ){
          errors.contractHours = 'Invalid contract hours'
        }

        return errors

      }}
    >
      {({ values,handleSubmit,setFieldValue,dirty }) =>
        <Modal
          closeIcon
          closeOnEscape={false}
          closeOnDimmerClick={false}
          open = {props.open}
          onClose= {() =>  props.setOpen(false)}
          onOpen= {() => props.setOpen (true)}
        >
          <ModalHeader>New Staff {props.name} </ModalHeader>
          <ModalContent>

            { loading &&
            <Dimmer active>
              <Loader />
            </Dimmer>
            }


            <Form style={{ marginBottom:'5rem' }}>
              <Grid>
                <Grid.Row>
                  <InputField name='name' label='Name' type='text' width='8'/>
                </Grid.Row>
                <Grid.Row>
                  <InputField name='email' label='Email' type='email'  width='8'/>
                </Grid.Row>
                <Grid.Row>
                  <InputField name='phone' label='Phone' type='tel'  width='8'/>

                </Grid.Row>
                <Grid.Row>
                  <DropDownField  name='contractType' labeled label='Contract'
                    selection
                    width='8'
                    options= {[{
                      key:1, value:'Contractor', text: 'Contractor' },
                    { key:2, value:'Employee', text: 'Employee' }]}
                    onChange = {  (e,{ value }) => {
                      setFieldValue('contractType',value)
                    }}
                  >

                  </DropDownField>


                </Grid.Row>
                <Grid.Row>
                  <InputField name='contractHours' label='Required Hours per day' type='number'  width='8'/>

                </Grid.Row>
                <Grid.Row>
                  <InputField name='position' label='Position' width='8'/>
                </Grid.Row>
                <Grid.Row>
                  <Form.Button icon type='button'  labelPosition='right' primary><Icon size='big' name='barcode'/>Link Id card</Form.Button>
                </Grid.Row>
              </Grid>
            </Form>
          </ModalContent>
          <Modal.Actions>
            <Button   negative onClick={() => props.setOpen (false)}>Cancel</Button>
            {dirty &&
            <Button  positive onClick= {() => handleSubmit()}>Save</Button>}
          </Modal.Actions>
        </Modal>
      }
    </Formik>

  )
}

export default NewStaffModel