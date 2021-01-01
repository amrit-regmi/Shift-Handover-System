import { useLazyQuery, useMutation } from '@apollo/client'
import React, { useContext, useEffect, useState } from 'react'
import { forEach } from 'lodash'
import { Button, Form, Modal } from 'semantic-ui-react'
import { Formik } from 'formik'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
import { NotificationContext } from '../../contexts/NotificationContext'
import { ALL_COSTUMERS } from '../../queries/costumerQuey'
import { ASSIGN_COSTUMERS } from '../../mutations/stationMutation'

const AssignCostumersModal = ({ open ,setOpen ,station }) => {
  const [,dispatch] = useContext(NotificationContext)
  const [costumerList,setCostumerList] = useState([])

  const[loadCostumers, { loading: costumerLoading ,data:costumerData }] = useLazyQuery(ALL_COSTUMERS)

  useEffect(() => {
    if(costumerData && costumerData.allCostumers){

      const currentCostumers = station.costumers.map(costumer => costumer.id)

      const costumerOptions =costumerData.allCostumers.map((costumer,index) => {
        return { key:index, value: costumer.id, text: costumer.name }
      } )
      setCostumerList(costumerOptions.filter( option => !currentCostumers.includes( option.value)))
    }


  },[costumerData, station.costumers])

  const [addCostumers] = useMutation (ASSIGN_COSTUMERS,{
    update: (store,{ data:{ assignCostumers } }) => {
      /**Add station information to each selected costumer on cache */
      forEach(assignCostumers.costumers, costumer => {
        store.modify({
          id: `Costumer:${costumer.id}`,
          fields:{
            stations(existingStationsRefs, { readField }) {
              if(existingStationsRefs.some(ref => readField('id',ref) === station.id)){
                return existingStationsRefs
              }
              return [...existingStationsRefs, { '__ref':`Sation:${station.id}` }]
            }
          }
        })
      },
      )
    },
    onCompleted: ( response) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, costumers assigned to station' ,type: 'SUCCESS' } })
      setOpen(false)
    },

    onerror: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to assign costumers'}<br/> {err.message}</> ,type: 'ERROR' } })
      setOpen(false)
    }
  })

  return(

    <Formik
      initialValues= {{
        costumers: []
      }}

      validate = { (values) => {
        const errors = {}
        if(!values.costumers.length){
          errors.costumers = 'Please select at least one costumer'
        }

        return errors
      }
      }
      onSubmit= {(values) => {
        addCostumers({ variables:{ ...values, stationId: station.id } })
      }}>

      {({ handleSubmit,setFieldValue }) =>

        <Modal
          open= {open}
          closeOnEscape= {false}
          closeOnDimmerClick={false}
        >
          <Modal.Header>Select costumers to Assign</Modal.Header>
          <Modal.Content>
            <Form>
              <DropDownField name='costumers' labeled label='Costumers'
                placeholder='Select Costumers'
                search
                loading={costumerLoading}
                selection
                multiple
                width='8'
                options= {costumerList}
                onFocus = {() => loadCostumers()}
                onChange = {  (e,{ value }) => {
                  setFieldValue('costumers',value)
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

export default AssignCostumersModal