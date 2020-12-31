import { useMutation, useQuery } from '@apollo/client'
import { FieldArray, Formik } from 'formik'
import _, { forEach } from 'lodash'
import React, { useContext, useEffect, useState } from 'react'
import { Button, Dimmer, Form, Grid, Header, Icon, List, Loader, Modal,ModalContent, ModalHeader, Segment } from 'semantic-ui-react'
import { NotificationContext } from '../../contexts/NotificationContext'
import { ADD_STATION } from '../../mutations/stationMutation'
import { ALL_COSTUMERS } from '../../queries/costumerQuey'
import { ALL_STATION } from '../../queries/stationQuery'
import { InputField, TimeInputField } from '../StationReportPage/NewReportForm/FormFields'
import { validateEmail, validateName } from '../StationReportPage/NewReportForm/validator'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
const NewStationModel = (props) => {

  const [,dispatch] = useContext(NotificationContext)
  const [addStationMutation,{ loading,error }] = useMutation(ADD_STATION)
  const [countryList,setCountryList]=  useState([])
  const [costumerList,setCostumerList] = useState([])

  const { loading: costumerLoading } = useQuery(ALL_COSTUMERS, { onCompleted : (data) => {
    if(data.allCostumers){
      const costumerOptions =data.allCostumers.map((costumer,index) => {
        return { key:index, value: costumer.id, text: costumer.name }
      } )
      setCostumerList(costumerOptions)
    }
  } })

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch('https://restcountries.eu/rest/v2/?fields=name;alpha2Code;')
      const countries = await response.json()
      const countryArray = countries.map((country,index) => {
        const exclude = ['aq','bq','cw','gg','im','je','xk','bl','mf','sx','ss']
        if(exclude.includes(country.alpha2Code.toLowerCase())){ //exclusdw coutry codes have no flags defined on semntic ui so return without flag
          return { key:index, value: country.name, text:  country.name  }
        }
        return { key:index, value: country.name, text:  country.name ,flag: country.alpha2Code.toLowerCase() }
      })
      setCountryList(countryArray)
    }

    fetchCountries()
  },[])

  const addStation = (values) => {
    addStationMutation({
      variables: values,
      update: (store,{ data:{ addStation } }) => {
        store.modify({
          fields:{
            allStations(existingStationRefs , { readField }){
              const newStation = addStation
              if(existingStationRefs.some(ref => readField('id',ref) === newStation.id)){
                return existingStationRefs
              }
              const update = { ...values,id: newStation.id }
              return [...existingStationRefs,update]

            }
          }

        })
        /**Add station information to each added costumer on cache */
        forEach(values.costumers, costumer => {
          store.modify({
            id: `Costumer:${costumer}`,
            fields:{
              stations(existingStationRefs, { readField }) {
                if(existingStationRefs.some(ref => readField('id',ref) === addStation.id)){
                  return existingStationRefs
                }
                return [...existingStationRefs, { '__ref':`Station:${addStation.id}` }]
              }
            }
          })
        })


      }
    }).then(
      res =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: `Success, ${values.location} added to station list` ,type: 'SUCCESS' } }),
      err =>  dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{`Error, ${values.location} cannot be added to station list`}<br/> {err.message}</> ,type: 'ERROR' } }),
      props.setOpen(false),
    )
  }


  const initVal = {
    location: '',
    address:{
      street:'',
      postcode:'',
      city:'',
      country:''
    },
    email: '',
    phone: '',
    costumers:[],
    shifts:[{ name:'',startTime:'' }],
    stationKey:'',
    stationKeyConfirm:''
  }
  return(
    <Formik
      initialValues = { initVal }
      onSubmit= {(values) => {
        addStation(values)
      }}
      validate = {(values) => {
        let errors = {}

        if(!values.location || (values.location && values.location.length < 3)){
          errors.location= 'Location is required and must be at least 3 charcter long'
        }

        if( !values.address.street || (values.address.street && values.address.street.length < 3) ){

          errors.address = { ...errors.address, street: 'Street is required and must be at least 3 charcter long' }
        }

        if( !values.address.city ){
          errors.address= { ...errors.address, city: 'City is required and must be at least 3 charcter long' }
        }

        if( !values.address.country ){
          errors.address = { ...errors.address,country:'Country is required' }
        }
        if( !values.email  || validateEmail(values.email)){
          errors.email = 'Email is required and must be valid'
        }

        if(values.shifts.length){
          forEach(values.shifts, (shift,index) => {
            if(!shift.name){
              if (!errors.shifts) errors.shifts=[]
              if (!errors.shifts[index] ) errors.shifts[index] = {}
              errors.shifts[index].name = 'Please provide shift name'
            }

            if(!shift.startTime){
              if (!errors.shifts) errors.shifts=[]
              if (!errors.shifts[index] ) errors.shifts[index] = {}

              errors.shifts[index].startTime = 'Shift start time is required'
            }

            if(shift.startTime){
              if(!shift.startTime.match(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)){
                if (!errors.shifts) errors.shifts=[]
                if (!errors.shifts[index] ) errors.shifts[index] = {}

                errors.shifts[index].startTime = 'Shift start should be on format HH:mm'
              }
            }

          }
          )
        }


        if( !values.stationKey || (values.stationKey && values.stationKey.length < 8)){
          errors.stationKey = 'Station key is required and should be at least 8 charter long'
        }
        if( values.stationKeyConfirm !== values.stationKey){
          errors.stationKeyConfirm = 'Station key confirm mismatch'
        }

        return errors

      }}
    >
      {({ values,handleSubmit,setFieldValue,dirty }) =>
        <Modal
          closeIcon
          closeOnEscape={false}
          closeOnDimmerClick={false}
          open = {props.open }
          onClose= {() =>  props.setOpen(false)}
          onOpen= {() => props.setOpen (true)}
        >
          <ModalHeader>New Station {props.name} </ModalHeader>
          <ModalContent>

            { loading &&
            <Dimmer active>
              <Loader />
            </Dimmer>
            }


            <Form style={{ marginBottom:'5rem' }} autoComplete="off">
              <Grid padded >
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='location' label='Location' type='text' width='8' placeholder='Location identifier ex: Airport code'/>
                </Grid.Row>
                <Grid.Row style={{ paddingTop:3 }}>
                  <DropDownField  name='address.country' labeled label='Country'
                    placeholder='Select Country'
                    search
                    selection
                    width='8'
                    options= {countryList}
                    onChange = {  (e,{ value }) => {
                      setFieldValue('address.country',value)
                    }}
                  >

                  </DropDownField>

                </Grid.Row>
                <Grid.Row><Header as ='h3'>Address</Header></Grid.Row>
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='address.street' label='Street' type='text' width='8'/>
                </Grid.Row>
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='address.postcode' label='postcode' type='text' width='8'/>
                </Grid.Row>
                <Grid.Row style={{ paddingTop:0 }}>
                  <InputField name='address.city' label='city' type='text' width='8'/>
                </Grid.Row>

                <Grid.Row><Header as ='h3'>Contact Information</Header></Grid.Row>
                <Grid.Row style={{ padding:0 }}>
                  <InputField name='email' label='Email' type='email'  width='8'/>
                </Grid.Row>
                <Grid.Row style={{ paddingTop:0 }}>
                  <InputField name='phone' label='Phone' type='tel'  width='8'/>
                </Grid.Row>

                <Grid.Row ><Header as ='h3'>Working Shift</Header></Grid.Row>
                <FieldArray  name={'shifts'}>
                  {({ push,remove }) => (<>
                    { values.shifts.length > 0 && values.shifts.map((shift,index) =>
                      <Grid.Row columns='2' key ={index} style={{ padding:0 }}>

                        <InputField name={`shifts[${index}].name`} label='Name' width='5' />
                        <TimeInputField name={`shifts[${index}].startTime`} label placeholder='Start Time' ></TimeInputField>
                        {index !== 0 &&
                        <Icon
                          link
                          name ="cancel"
                          color='red'
                          onClick={ (e) => remove(index)
                          }/>}

                      </Grid.Row>
                    )}
                    <Button
                      type='button'
                      icon
                      size ='mini'
                      primary
                      onClick={ (e) => push ({ name:'', startTime:'' })
                      }>
                      <Icon name="plus circle"/> Add
                    </Button>
                  </>)}



                </FieldArray>

                <Grid.Row><Header as ='h3'>Costumers</Header></Grid.Row>
                <DropDownField  name='costumers'
                  placeholder='Select Costumers'
                  multiple
                  search
                  selection
                  width='8'
                  loading= {costumerLoading}
                  options= {costumerList}
                  onChange = {  (e,{ value }) => {
                    setFieldValue('costumers',value)
                  }}
                >

                </DropDownField>
                <Grid.Row><Header as ='h3'>Station Key</Header></Grid.Row>
                <Grid.Row style={{ padding:0 }}> <InputField name='stationKey' type='password' width='8' placeholder='stationKey' /> </Grid.Row>
                <Grid.Row style={{ padding:0 }}> <InputField name='stationKeyConfirm' type='password' width='8' placeholder='Confirm stationKey' /> </Grid.Row>


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

export default NewStationModel