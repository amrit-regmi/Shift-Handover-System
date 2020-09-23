import React, { Fragment } from 'react'
import { Header, Button, Icon } from 'semantic-ui-react'
import { AircraftCheckBox, TaskDescriptionField, TextAreaField } from './FormFields'
import { FieldArray } from 'formik'

const AircraftSelectionForm = ({ costumers,setCheckedAircrafts,checkedAircrafts,values }) => {
  return (<>
    {costumers && costumers.map(costumer =>
      <Fragment key= {costumer.name }>
        <Header as="h3">Work Performed for {costumer.name}</Header>


        {costumer.aircrafts.map(aircraft =>
          <Fragment key={aircraft.id}>
            <AircraftCheckBox
              label = {aircraft.registration}

              checked = {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['checked']}
              disabled = {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['disbleCheck']}
              onChange={
                (e,{ checked }) =>  {
                  e.preventDefault()
                  setCheckedAircrafts({ ...checkedAircrafts,[aircraft.registration]:{ 'checked':checked } })
                  //if the aircraft is checked by user it should initalize with a taskarea input
                  if(checked && (!values.tasks[aircraft.registration] || values.tasks[aircraft.registration].length === 0) ){
                    values.tasks[aircraft.registration] = [{ description:'',status:''   }]
                  }
                }

              }>
              {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['checked'] &&
                       <FieldArray name={`tasks.${aircraft.registration}`}>
                         {({ push,remove }) => (<>


                           {values.tasks[aircraft.registration] && values.tasks[aircraft.registration].map((task,index) =>
                             <TaskDescriptionField key={index}

                               label= {index}
                               taskName = {`tasks.${aircraft.registration}.${index}`}
                               name={`tasks.${aircraft.registration}.${index}.description`}
                               //The input Field is disabled if the task is open or deferred from previous shifts implied by task.id field
                               disabled = {task.id && (task.status === 'DEFERRED' || task.status==='OPEN')}
                               onRemove = {
                                 () => {

                                   if(values.tasks[aircraft.registration].length===1){
                                     setCheckedAircrafts({ ...checkedAircrafts,[aircraft.registration]:{ 'checked':false } })
                                   }
                                   remove(index)
                                 }
                               }
                             >
                               <TextAreaField style= {{ paddingBotton:'5px' }} name={`tasks.${aircraft.registration}.${index}.newNote` }/>

                             </TaskDescriptionField>



                           )}
                           <Button
                             type='button'
                             icon
                             style={{ marginLeft:'10px' }}
                             primary
                             onClick={
                               () => push({ description:'',status:'' })
                             }>
                             <Icon name="plus circle"/> Add
                           </Button>

                         </>)}

                       </FieldArray>

              }
            </AircraftCheckBox>

          </Fragment>
        )}


      </Fragment>)}
  </>

  )
}

export default AircraftSelectionForm