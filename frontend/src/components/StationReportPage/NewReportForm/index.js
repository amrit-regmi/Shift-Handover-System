import React, { useState, useContext, useEffect } from 'react'
import { Formik } from 'formik'
import Context from '../Context'
import { Form, Header, Button, Icon } from 'semantic-ui-react'
import DateInputField from './FormFields'
import { validateStaffsField, validateTasks } from '../validator'
import { formatDate, operateDate } from '../../../utils/DateHelper'
import _ from 'lodash'
import StaffForm from './StaffForm'
import AircraftSelectionForm from './AircraftSelectionForm'



const NewReport = ({ reportData }) => {
  const context = useContext(Context)
  const station = context.state.station

  //if there is a task from a costumer who is not on costumers list we add it here along with the
  const [costumers,setCostumers] = useState(station.costumers)

  const [checkedAircrafts, setCheckedAircrafts] = useState({})
  const init = {
    station: station.id,
    startTime:'', //default shift starttime
    endTime:'',
    staffs:[],
    tasks:{}
  }
  const [initialFields,setInitialFields] = useState(init)


  useEffect (() => {
    //initial aircraft list from last shift report
    let list = {}
    //initial task list from last shift report
    let taskList = {}
    let costumerList = []

    // eslint-disable-next-line array-callback-return
    reportData.tasks.map(task =>  {
      if(task.id && task.aircraft && (task.status==='DEFERRED' || task.status==='OPEN') ){
        // Initial field for deferred or open tasks
        const simplifiedTask = { id:task.id, description:task.description, status:task.status ,updates: task.updates ,action:'', newNote:'' }

        //From the last shift report if the aircraft has open tasks it is checked by default and cannot be disabled
        list[task.aircraft.registration] = { checked:true,disbleCheck:true }

        //arranging tasks based on aircraft registration
        if(taskList[task.aircraft.registration]){

          taskList[task.aircraft.registration].push( simplifiedTask)

        }else {

          taskList[task.aircraft.registration] = [ simplifiedTask]

        }

        if(! _.find( station.costumers,_.matchesProperty('name',task.aircraft.costumer.name))){
          if( ! _.find( costumerList,_.matchesProperty('name',task.aircraft.costumer.name))){
            costumerList.push({ name:task.aircraft.costumer.name,aircrafts:[{ registration:task.aircraft.registration,id: task.aircraft.id }] })
          }else{
            costumerList.aircrafts.push({ registration:task.aircraft.registration , id: task.aircraft.id })
          }
        }
      }
    }
    )

    setCostumers([...costumers,...costumerList])

    //Set initail form values based on shiftreport
    setInitialFields({ ...initialFields,tasks:taskList })
    setCheckedAircrafts(list)

  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ,[])





  return (
    <Formik
      enableReinitialize
      initialValues = {initialFields}
      validate = { values => {
        let errors = {}
        //errors = { ...errors,...validateStartEndTime(values.startTime,values.endTime) }
        const staffErrors = validateStaffsField(values.staffs)
        const taskErrors = validateTasks(values.tasks)

        if(!_.isEmpty(taskErrors) ) errors.tasks = taskErrors
        if(!_.isEmpty(staffErrors) ) errors.staffs = staffErrors
        console.log(errors)
        return errors

      }}
      onSubmit={(values) => {
        console.log('submit Clicked')
        console.log(values)

      }}
    >

      {({ values,handleSubmit,errors,touched }) =>
        <Form onSubmit = {handleSubmit}>
          {/*Shift start end times*/}
          <Form.Group >
            <DateInputField
              label = "Shift Start Time"
              name='startTime'
              maxDate = {operateDate(Date.now(),30,'m','sub')}
              minDate= {operateDate(Date.now(),20,'h','sub')}/>

            <DateInputField
              label = "Shift End Time"
              name='endTime'
              maxDate = {formatDate(Date.now())}
              minDate= {operateDate(values.startTime,20,'m','add')}/>
          </Form.Group>

          {/*Dynamic Input fields for staff Information*/}
          <StaffForm values={values} touched={touched} errors={errors}  />

          {/*Dynamic Input fields for Aircraft Tasks*/}
          <AircraftSelectionForm costumers ={costumers} checkedAircrafts={checkedAircrafts} setCheckedAircrafts= {setCheckedAircrafts} values={values} />



          <Header as="h3">Work Performed for Other Costumer</Header>
          <Button  type='button' icon primary><Icon name="plus circle"/> Add </Button>

          <Header as="h3">Other Tasks</Header>
          <Button  type='button' icon primary><Icon name="plus circle"/> Add </Button>

          <Header as="h3">Logistics Task</Header>
          <Button  type='button' icon primary><Icon name="plus circle"/> Add </Button>



          <Button  primary type="submit"> Submit Report </Button>
        </Form> }

    </Formik>

  )
}

export default NewReport