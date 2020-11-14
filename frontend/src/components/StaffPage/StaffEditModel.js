import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import _ from 'lodash'
import React, { useEffect } from 'react'
import { Button, Dimmer, Form, Grid, Loader, Modal,ModalContent, ModalHeader } from 'semantic-ui-react'
import { STAFF_EDIT } from '../../mutations/staffMutation'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
const StaffEditModel = (props) => {

  const [updateStaff,{ loading: updateStaffLoading }] = useMutation(STAFF_EDIT)


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

          onSubmit= {(values) => {
            const updatedValues = _.omitBy(values, (v,k) => initVal[k] === v )

            updateStaff({ variables:{ ...updatedValues,id:props.id } })
          }}
        >
          {({ values,handleSubmit,setFieldValue,dirty }) => <Form style={{ marginBottom:'5rem' }} onSubmit= {handleSubmit}>
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