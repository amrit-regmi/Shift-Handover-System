import React, { useState, useContext, useEffect } from 'react'
import { Formik } from 'formik'
import Context from '../Context'
import { Form, Header, Button, Dimmer, Segment, Loader, Message } from 'semantic-ui-react'
import { DateInputField } from './FormFields'
import { validateStaffsField, validateStartEndTime, validateTasks } from './validator'
import { formatDate, operateDate, toDate } from '../../../utils/DateHelper'
import _ from 'lodash'
import StaffForms from './StaffForms'
import AircraftSelectionForm from './AircraftSelectionForm'
import TaskForms from './TaskForms'
import StaffAddModel from './StaffAddModel'
import { useMutation } from '@apollo/client'
import { SUBMIT_REPORT } from '../../../mutations/submitShiftReport'
import { GET_SHIFT_REPORT } from '../../../queries/shiftReportQuery'
import { NotificationContext } from '../../../contexts/NotificationContext'
import { Persist } from 'formik-persist'

const NewReportForm = ({ setActiveItem }) => {
  const context = useContext(Context)
  const[,dispatch] = useContext(NotificationContext)
  const station = context.state.station
  const reportData = context.state.lastShiftReport

  const [openAddStaffModel,setOpenAddStaffModel] = useState (false)

  // costumers assigned to this station
  const [costumers,setCostumers] = useState(station.costumers)

  const [checkedAircrafts, setCheckedAircrafts] = useState({})
  const init = {
    startTime:'', //default shift starttime
    endTime:'',
    staffs:[],
    tasks:{}
  }
  const [initialFields,setInitialFields] = useState(init)

  const [submitReport,{ loading ,error }] = useMutation(SUBMIT_REPORT,{
    update(store,result) {
      const data = { getShiftReport: result.data.submitShiftReport }
      store.writeQuery(
        { query: GET_SHIFT_REPORT ,
          variables:{
            station: station.id,
            flag:'MOST_RECENTLY_COMPLETED'
          },
          data
        }
      )
    },

    onCompleted: () => {
      localStorage.clear(reportData.id) /**Clearing persisted form */
      setActiveItem('lastShiftReport')
    },

    onError: (error) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: error.message ,type: 'ERROR' } })
    }
  })

  /**Function to get the shift name based on start time */
  const getShiftName = (startTime) => {
    const sdt = new Date(toDate(startTime))
    const shiftName = station.shifts.reduce((p,c) => {
      /**Setting the shiftTime to given startTime for comparision  */
      const splitSt = c.startTime.split(':')
      const st = new Date(sdt)
      st.setHours(splitSt[0])
      st.setMinutes(splitSt[1])
      /** Diffence between given startTIme and shift startttime */
      const diff = (sdt-st)/(60*60*1000)
      /**return the lowest positive diffence if exist or highest negative differnce*/
      if((diff > p.diff && p.diff < 0) ){
        return { name: c.name ,diff: diff }
      }
      if(diff > 0 && diff< p.diff){
        return { name: c.name ,diff: diff }
      }
      return p
    },{ name:'',diff:-24 })
    return shiftName.name
  }

  useEffect (() => {
    //initial aircraft list from last shift report
    let list = {}
    //initial task list from last shift report
    let taskList = {}
    let costumerList = []

    // eslint-disable-next-line array-callback-return
    reportData && reportData.tasks && reportData.tasks.map(task =>  {
      if( (task.status==='DEFERRED' || task.status==='OPEN') ){
        // Initial field for deferred or open tasks
        const simplifiedTask = { id:task.id, aircraft:task.aircraft, description:task.description, status:task.status ,updates: task.updates ,action:'', newNote:'',taskCategory:task.taskCategory }

        //From the last shift report if the task is aircraft tasks aircraft has open tasks it is checked by default and cannot be disabled
        if(task.aircraft) {
          list[task.aircraft.registration] = { checked:true,disbleCheck:true }
        }

        //arranging tasks based on aircraft registration
        if(task.aircraft && taskList[task.aircraft.registration]){
          taskList[task.aircraft.registration].push( { ...simplifiedTask })

        }else if (task.aircraft){
          taskList[task.aircraft.registration] = [ { ...simplifiedTask }]

        }else{
          if(taskList[task.taskCategory]){
            taskList[task.taskCategory].push(simplifiedTask)
          }else{
            taskList[task.taskCategory] = [simplifiedTask]
          }


        }

        //if there is a task from a costumer who is not this station costumer list we add that arcraft & costumer to list
        if(task.aircraft){
          /**Check if there is a match with station costumers */
          if(! _.find( station.costumers,_.matchesProperty('name',task.aircraft.costumer.name))){
            /**Check if the costumer name is already added to the extra costumer list */
            const exisitingItem = _.find( costumerList,_.matchesProperty('name',task.aircraft.costumer.name))
            if( !exisitingItem ){
              costumerList.push({ name:task.aircraft.costumer.name,aircrafts:[{ registration:task.aircraft.registration,id: task.aircraft.id }] })
            }else{
              const aircraftInList= exisitingItem.aircrafts.some(aircraft => aircraft.registration === task.aircraft.registration )
              if(!aircraftInList){
                exisitingItem.aircrafts.push({ registration:task.aircraft.registration , id: task.aircraft.id })
              }
            }
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

  /**Format submit data  before submit*/
  const beforeSubmit = (formdata) => {
    let submitData = { station: station.id , staffs: formdata.staffs, startTime:formdata.startTime, endTime: formdata.endTime, tasks:{} }

    /**Reduce the tasks to be only array of tasks */
    const updatedTasks =  _.reduce(formdata.tasks, (tasks,tasksByIdentifier,identifier) => {
      let taskList = _.map(tasksByIdentifier, (task,index) => {
        let initialTask
        /**Compare the task with the initial tasks, reduce to only include the changes */
        if(initialFields.tasks[identifier] && initialFields.tasks[identifier][index]){
          initialTask = initialFields.tasks[identifier] && initialFields.tasks[identifier][index]
          const difference = Object.keys(initialTask).filter(k => initialTask[k] !== task[k])

          /**If no changes return null */
          if(!difference) return null
          const reducedTask = difference.reduce((p,c) => p[c] = { ...p,[c]:task[c] },{})
          task = { id: task.id, ...reducedTask }

          /**
           * If form is loaded from persist then task is compred against so removing the nonessential fields */
          delete(task.aircraft)
          delete(task.updates)

        }

        return task
      })

      /**remove null tasks */
      taskList = taskList.filter(task => task !== null)

      return [...tasks,...taskList]
    },[])


    /**Only include staff signoff Key and name */
    const staffs = formdata.staffs.map((staff) => {return { signOffKey: staff.signOffKey, name:staff.name }})

    submitData = { ...submitData,tasks: updatedTasks, staffs: staffs ,shift: getShiftName(formdata.startTime) }

    return submitData

  }

  if(loading) {
    return(
      <Segment style={{ height:'10rem' }} basic size='huge'>
        <Dimmer active inverted>
          <Loader inverted>Submitting Data</Loader>
        </Dimmer>
      </Segment>
    )
  }

  return (
    <>
      <Formik
        enableReinitialize
        initialValues = {initialFields}
        validate = { values => {
          let errors = {}
          errors = { ...errors,...validateStartEndTime(values.startTime,values.endTime) }
          const staffErrors = validateStaffsField(values.staffs)
          const taskErrors = validateTasks(values.tasks)

          if(!_.isEmpty(taskErrors) ) errors.tasks = taskErrors
          if(!_.isEmpty(staffErrors) ) errors.staffs = staffErrors

          return errors

        }}
        onSubmit={(values) => {
          const submitData = beforeSubmit(values)
          submitReport({ variables: submitData })

        }}
      >

        {({ values,handleSubmit,errors,touched,submitCount }) =>
          <>
            <Form onSubmit = {(e) => {
              e.preventDefault()
              handleSubmit()
            }}>
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
              <StaffForms values={values} touched={touched} errors={errors} addStaffOpen =  {setOpenAddStaffModel}/>

              {/*Dynamic Input fields for Aircraft Tasks*/}
              <AircraftSelectionForm costumers ={costumers} checkedAircrafts={checkedAircrafts} setCheckedAircrafts= {setCheckedAircrafts} values={values} />

              {/*Dynamic Input fields for Other Tasks*/}
              <Header as="h3">Other Tasks</Header>
              <TaskForms tasksIdentifier = 'OTHER' tasks = {values.tasks.OTHER}> </TaskForms>

              {/*Dynamic Input fields for Other Tasks*/}
              <Header as="h3">Logistics Task</Header>
              <TaskForms tasksIdentifier = 'LOGISTICS' tasks = {values.tasks.LOGISTICS}> </TaskForms>

              <Message
                error
                content={
                  <>
                    <Header as='h5'>There are some errors on the report <Header.Subheader>Please fix the errors before trying again</Header.Subheader></Header>
                    {error &&
                  <p>{error.message}</p>}
                  </>

                }
                visible ={(!_.isEmpty(errors) && submitCount > 0) || error}
              />

              <Message
                success
                content={
                  <Header as='h5'>Great! Everything seems to be fixed <Header.Subheader>Please, proceed to submit whenever ready</Header.Subheader></Header>
                }
                visible ={(_.isEmpty(errors) && submitCount > 0 ) && !error}
              />

              <Segment disabled = {!_.isEmpty(errors) && submitCount > 0} color='blue' inverted tertiary clearing>
                <Button floated='right' type="submit" primary> Submit Report </Button>
              </Segment>

              <Persist name={reportData.id} />
            </Form>
            <StaffAddModel setOpen= {setOpenAddStaffModel} open= {openAddStaffModel} shiftStartTime = {values.startTime} shiftEndTime={values.endTime}></StaffAddModel></>}


      </Formik>

    </>

  )
}

export default NewReportForm