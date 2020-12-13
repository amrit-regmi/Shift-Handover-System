import { useMutation, useLazyQuery, gql } from '@apollo/client'
import { FieldArray, Formik } from 'formik'
import { cloneDeep, forEach } from 'lodash'
import React, { useEffect, useState } from 'react'
import { Button, Dimmer, Form, Grid, Header, Icon, Loader, Modal,ModalContent, ModalHeader } from 'semantic-ui-react'
import { ADD_COSTUMER } from '../../mutations/costumerMutation'
import { ALL_STATION, GET_STATION } from '../../queries/stationQuery'
import { InputField } from '../StationReportPage/NewReportForm/FormFields'
import { validateEmail } from '../StationReportPage/NewReportForm/validator'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
const NewCostumerModel = (props) => {

  const [stationOptions,setStationOptions]=  useState([])
  const[addCostumerMutation, { loading,error }] = useMutation(ADD_COSTUMER)

  const [loadStations, { loading:stationLoading, data: stationData }] = useLazyQuery(ALL_STATION)

  useEffect(() => {
    if(stationData && stationData.allStations){
      const stations =stationData.allStations.map((station,index) => {
        return { key:index, value: station.id, text:station.location }
      } )
      setStationOptions(stations)
    }

  },[stationData])


  const addCostumer = (values) => {
    addCostumerMutation({
      variables: values,
      update: (store,{ data: { addCostumer } }) => {

        forEach( addCostumer.stations, station => {
          try { /** Append costumer to corresponding stations in cache */
            const { getStation: data } = cloneDeep(store.readQuery({
              query: GET_STATION,
              variables: { id: station.id } }))

            store.writeQuery({
              query: GET_STATION,
              variables: { id: station.id } ,
              data: {
                ...data,costumers :[...data.costumers, addCostumer]
              }
            })
          }
          catch (e) {
            /**No query found */
          }

        })

        /**Append to costumers List */
        store.modify({
          fields:{
            allCostumers(existingCostumersRefs = [] , { readField }){
              const newCostumerRef  = store.writeFragment({
                data: addCostumer,
                fragment : gql `
                  fragment NewCostumer on Costumer {
                    name
                    id
                    contract
                    aircrafts{
                      id
                      registration
                    }
                    stations{
                      id
                    }

                  }   
                `
              })

              if(existingCostumersRefs.some(ref => readField('id',ref) === addCostumer.id)){
                return existingCostumersRefs
              }
              return [...existingCostumersRefs,newCostumerRef]
            }
          }
        })

      }
    })
  }


  if(error){
    console.log(error)
  }


  const initVal = {
    name: '',
    contract:'',
    keyContacts: [],
    stations:[],
    aircrafts:'',

  }
  return(
    <Formik
      initialValues = { initVal }
      onSubmit= {(values) => {

        const submittedValues = { ...values , aircrafts: values.aircrafts ? values.aircrafts.toUpperCase().split(','):[] }
        addCostumer(submittedValues)
      }}
      validate = {(values) => {
        let errors = {}

        if(!values.name || (values.name && values.name.length < 3)){
          errors.name= 'Costumer Name is required and must be at least 3 charcter long'
        }

        if( !values.contract ){
          errors.contract = 'Please specify contract type ex: Ad-HOC, LongTerm , Seasonal etc.'
        }

        if( values.aircrafts ){
          const errAircraft =[]
          forEach(values.aircrafts.split(','), aircraft => {
            if(aircraft.trim().length < 3) errAircraft.push(aircraft.toUpperCase())
          })
          if (errAircraft.length ){
            errors.aircrafts = `${errAircraft.toString()} invalid Aircraft Registration, should at least 3 characters`
          }
        }

        if(values.keyContacts.length){
          forEach(values.keyContacts, (contact,index) => {
            if(!contact.description){
              if (!errors.keyContacts) errors.keyContacts=[]
              if (!errors.keyContacts[index] ) errors.keyContacts[index] = {}
              errors.keyContacts[index].description = 'Please provide contact description'
            }

            if(!contact.phone && !contact.email){
              if (!errors.keyContacts) errors.keyContacts=[]
              if (!errors.keyContacts[index] ) errors.keyContacts[index] = {}

              errors.keyContacts[index].phone = 'At least a phone or a email is required'
              errors.keyContacts[index].email = 'At least a phone or a email is required'
            }

            if(contact.email){
              if(validateEmail(contact.email)){
                if (!errors.keyContacts) errors.keyContacts=[]
                if (!errors.keyContacts[index] ) errors.keyContacts[index] = {}
                errors.keyContacts[index].email = 'Invalid Email'
              }
            }

          }
          )
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
          <ModalHeader>New Costumer </ModalHeader>
          <ModalContent>

            { loading &&
            <Dimmer active>
              <Loader />
            </Dimmer>
            }


            <Form style={{ marginBottom:'5rem' }} autoComplete="off"
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }
              }>
              <Grid padded >
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='name' label='Name' type='text' width='8' placeholder='Costumer Name'/>
                </Grid.Row>
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='contract' label='Contract' type='text' width='8' placeholder='Ex: Ad-Hoc, Short-term , Long-term, Seasonal'/>
                </Grid.Row>
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='aircrafts' label='Aircrafts' type='text' width='8' placeholder='Aircrfat Registrations separeted by comma ","'/>
                </Grid.Row>
                <Grid.Row style={{ paddingTop:3 }}>
                  <DropDownField  name='stations' labeled label='Station'
                    placeholder='Select Stations'
                    search
                    loading={stationLoading}
                    selection
                    multiple
                    width='8'
                    options= {stationOptions}
                    onFocus = {() => loadStations()}
                    onChange = {  (e,{ value }) => {
                      setFieldValue('stations',value)
                    }}
                  >
                  </DropDownField>
                </Grid.Row>


                <Grid.Row><Header as ='h3'>Key Contacts</Header></Grid.Row>
                <FieldArray  name={'keyContacts'}>
                  {({ push,remove }) => (<>
                    { values.keyContacts.length > 0 && values.keyContacts.map((contact,index) => <Grid.Row key ={index} style={{ padding:0 }}>
                      <Form.Group style={{ margin:0 }} widths='13'><InputField name={`keyContacts[${index}].description`} label='Description' /><InputField name={`keyContacts[${index}].phone`} label='Phone' /><InputField name={`keyContacts[${index}].email`} label='Email' />
                        <Icon
                          link
                          name ="cancel"
                          color='red'
                          onClick={ () => remove(index)
                          }/>
                      </Form.Group>
                    </Grid.Row>
                    )}
                    <Button
                      style= {{ marginTop:'1rem' }}
                      type='button'
                      icon
                      size ='mini'
                      primary
                      onClick={ () => push ({ description:'',phone:'' ,email:'' })
                      }>
                      <Icon name="plus circle"/> Add
                    </Button>
                  </>)}
                </FieldArray>
              </Grid>
            </Form>
          </ModalContent>
          <Modal.Actions>
            <Button   negative onClick={() => props.setOpen (false)}>Cancel</Button>
            {dirty &&
            <Button  positive onClick= {(e) => {
              e.preventDefault()
              handleSubmit()
            }}>Save</Button>}
          </Modal.Actions>
        </Modal>
      }
    </Formik>

  )
}

export default NewCostumerModel