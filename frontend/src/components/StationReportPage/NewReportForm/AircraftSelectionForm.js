import React, { Fragment, useState } from 'react'
import { Header, Confirm } from 'semantic-ui-react'
import { AircraftCheckBox } from './FormFields'
import { useFormikContext } from 'formik'
import TaskForms from './TaskForms'

const AircraftSelectionForm = ({ costumers,setCheckedAircrafts,checkedAircrafts,values }) => {
  const { setFieldValue } = useFormikContext()
  const [confirmOpen,setConfirmOpen] = useState ({ open:false,aircraft:'',event:'' })

  return (<>
    {costumers && costumers.map(costumer =>
      <Fragment key= {costumer.name }>
        <Header as="h3">Work Performed for {costumer.name}</Header>


        {costumer.aircrafts.map(aircraft =>

          <Fragment key={aircraft.id}>
            <AircraftCheckBox
              label = {aircraft.registration}

              // If the aircaft registration is on the checked list the checkbox should be checked
              checked = {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['checked']}

              //If the aircraft reistration is on the checked list and is disabled the checkbox is disabled
              disabled = {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['disbleCheck']}

              onChange={
                (e,{ checked }) =>  {
                  e.preventDefault()
                  //if the aircraft is checked by user it should initalize with a taskarea input
                  if(checked && (!values.tasks[aircraft.registration] || values.tasks[aircraft.registration].length === 0) ){
                    setCheckedAircrafts({ ...checkedAircrafts,[aircraft.registration]:{ 'checked':checked } })
                    setFieldValue(`tasks.${aircraft.registration}`,[{ description:'',status:'' ,action:'',taskCategory:'AIRCRAFT' ,aircraft: aircraft.id }])
                  }
                  if(!checked) {
                    if(values.tasks[aircraft.registration].length >0 ){
                      setConfirmOpen({ open:true, aircraft:aircraft.registration })
                    }
                  }
                }

              }>


              {/**
              * If Unchecked diaplay all task will be erased warning
              */}
              <Confirm
                open = {confirmOpen.open}
                header = {`Uncheck Aircraft ${confirmOpen.aircraft}`}
                content= {'Are you sure you want to uncheck this aircraft? Doing so will remove all the entered tasks for this Aircraft'}
                onCancel = { () => {
                  setConfirmOpen({ open:false })
                }}
                onConfirm = { () => {
                  setFieldValue(`tasks.${confirmOpen.aircraft}`,null)
                  setCheckedAircrafts({ ...checkedAircrafts,[confirmOpen.aircraft]:{ 'checked':false } })
                  setConfirmOpen({ open:false })
                }}
              />

              {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['checked'] &&
              <TaskForms
                tasksIdentifier={aircraft.registration}
                tasks={values.tasks[aircraft.registration]}
                taskCategory= 'AIRCRAFT'
                aircraftId = {aircraft.id}
                onRemove = {
                  () => {
                    /**
                     * If the last remaining task is removed then the aircraft chekbox should uncheck
                     */
                    if(values.tasks[aircraft.registration].length===1){
                      setCheckedAircrafts({ ...checkedAircrafts,[aircraft.registration]:{ 'checked':false } })
                    }

                  }}
              ></TaskForms>
              }
            </AircraftCheckBox>

          </Fragment>
        )}


      </Fragment>)}
  </>

  )
}

export default AircraftSelectionForm