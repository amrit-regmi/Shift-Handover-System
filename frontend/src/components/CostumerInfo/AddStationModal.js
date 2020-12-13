import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { ADD_STATION_TO_COSTUMER } from '../../mutations/costumerMutation'
import { forEach } from 'lodash'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Formik } from 'formik'
import { ALL_STATION } from '../../queries/stationQuery'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'

const AddStationModal = ({ open ,setOpen ,costumer }) => {

  const[stationOptions,setStationOptions] = useState([])
  const [loadStations, { loading:stationLoading, data: stationData }] = useLazyQuery(ALL_STATION)

  useEffect(() => {
    if(stationData && stationData.allStations){

      const existingStationIds = costumer.stations.map(station => station.id)
      let options = []
      /**Set station options, do not display if the station already exists for costumer */
      stationData.allStations.reduce((p,c,i) => {
        if(c.id && !existingStationIds.includes(c.id)){
          options.push( { key:i, value: c.id, text:c.location })
        }
        return options
      },[])


      setStationOptions(options)
    }

  },[costumer.stations, stationData])

  const [addStation] = useMutation (ADD_STATION_TO_COSTUMER,{
    update: (store,{ data:{ addStationsToCostumer } }) => {
      /**Add costumer information to each station on cache */
      forEach(addStationsToCostumer.stations, station => {
        store.modify({
          id: `Station:${station.id}`,
          fields:{
            costumers(existingCostumerRefs, { readField }) {
              if(existingCostumerRefs.some(ref => readField('id',ref) === addStationsToCostumer.id)){
                return existingCostumerRefs
              }
              return [...existingCostumerRefs, { '__ref':`Costumer:${addStationsToCostumer.id}` }]
            }
          }
        })
      })
    }
  })

  return(

    <Formik
      initialValues= {{
        stations: []
      }}

      validate = { (values) => {
        const errors = {}
        if(!values.stations.length){
          errors.stations = 'Please select at least one station'
        }

        return errors
      }
      }
      onSubmit= {(values) => {
        addStation({ variables:{ ...values, costumer: costumer.id } })
      }}>

      {({ handleSubmit,setFieldValue,dirty }) =>

        <Modal
          open= {open}
          closeOnEscape= {false}
          closeOnDimmerClick={false}
        >
          <Modal.Header>Select Stations to Add</Modal.Header>
          <Modal.Content>
            <Form>
              <DropDownField name='stations' labeled label='Station'
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
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button type='submit' positive onClick= { (e) => {
              e.preventDefault()
              handleSubmit()
            }
            }> Add </Button>
            <Button type='button' negative onClick = {() => setOpen(false)}> Cancel </Button>
          </Modal.Actions>




        </Modal>}

    </Formik>




  )


}

export default AddStationModal