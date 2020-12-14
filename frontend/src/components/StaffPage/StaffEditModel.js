import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useContext, useEffect } from 'react'
import { Button, Dimmer, Form, Grid, Loader, Modal,ModalContent, ModalHeader } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { STAFF_EDIT } from '../../mutations/staffMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { validateEmail } from '../StationReportPage/NewReportForm/validator'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
const StaffEditModel = (props) => {
  const [,dispatch] = useContext(NotificationContext)

  const [updateStaff,{ loading: updateStaffLoading }] = useMutation(STAFF_EDIT,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, staff information saved' ,type: 'SUCCESS' } })
      props.setOpen(false)
    },

    onError: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to save edited information'}<br/> {err.message}</> ,type: 'ERROR' } })
      props.setOpen(false)
    }
  })


  const initVal = { email: props.email,
    phone: props.phone || '',
    contractType: props.contractType,
    contractHours: props.reqHours,
    position: props.position || '',
  }
  return(
    <Modal
      closeIcon
      closeOnEscape={false}
      closeOnDimmerClick={false}
      open = {props.open}
      onClose= {() =>  props.setOpen(false)}
      onOpen= {() => props.setOpen (true)}
    >
      <ModalHeader>Editing Staff {props.name} </ModalHeader>
      <ModalContent>

        {updateStaffLoading &&
            <Dimmer active>
              <Loader />
            </Dimmer>
        }

        <Formik
          initialValues = { initVal }
          validate= {(values) =>
          {
            const errors = {}
            if(/[a-z]/i.test(values.phone)){
              errors.phone='Phone number cannot contain alphabets '
            }
            if(values.phone && values.phone.length < 8){
              errors.phone='Phone number should be at least 8 charter long '
            }
            if(validateEmail(values.email)){
              errors.email ='Invalid Email'
            }
            if(isNaN(values.contractHours)){
              errors.contractHours ='Contract Hours must be number'
            }
            return errors
          }}

          onSubmit= {(values) => {
            const updatedValues = _.omitBy(values, (v,k) => initVal[k] === v )

            updateStaff({ variables:{ ...updatedValues,id:props.id } })
          }}
        >
          {({ values,handleSubmit,setFieldValue,dirty,errors }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>
            <Grid>
              <Grid.Row>
                <InputField name='email' label='Email' type='email'/>
              </Grid.Row>
              <Grid.Row>
                <InputField name='phone' label='Phone' type='tel'/>

              </Grid.Row>
              <Grid.Row>
                <DropDownField  name='contractType' labeled label='Contract'
                  selection
                  options= {[{
                    key:1, value:'Contractor', text: 'Contractor' },
                  { key:2, value:'Employee', text: 'Employee' }]}></DropDownField>


              </Grid.Row>
              <Grid.Row>
                <InputField name='contractHours' label='Required Hours per day'/>

              </Grid.Row>
              <Grid.Row>
                <InputField name='position' label='Position'/>
              </Grid.Row>
            </Grid>
            {dirty &&
            <Button type='submit' floated='right' positive>Save</Button>}

          </Form>
          }
        </Formik></ModalContent>
    </Modal>

  )
}

export default StaffEditModel