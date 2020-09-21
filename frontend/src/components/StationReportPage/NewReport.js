import React, { useState, useContext, Fragment, useEffect } from 'react'
import { Formik, FieldArray } from 'formik'
import Context from './Context'
import { Form, Segment, Header, Button, Icon , Label,  } from 'semantic-ui-react'
import DateInputFiled, { AircraftCheckBox, InputFiled, TaskDescriptionField, TextAreaField  } from './FormFields'


const NewReport = ({ reportData }) => {
  const context = useContext(Context)
  const station = context.state.station

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

    // eslint-disable-next-line array-callback-return
    reportData.tasks.map(task =>  {
      if(task.id && task.aircraft && (task.status==='DEFERRED' || task.status==='OPEN') ){
        const simplifiedTask = { id:task.id, description:task.description, status:task.status ,updates: task.updates, newUpdate:'' }

        //From the last shift report if the aircraft has open tasks it is checked by default and cannot be disabled
        list[task.aircraft.registration] = { checked:true,disbleCheck:true }

        //arranging tasks based on aircraft registration
        if(taskList[task.aircraft.registration]){

          taskList[task.aircraft.registration].push( simplifiedTask)

        }else {

          taskList[task.aircraft.registration] = [ simplifiedTask]

        }

      }
    }
    )

    setInitialFields({ ...initialFields,tasks:taskList })
    setCheckedAircrafts(list)

  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ,[])





  return (
    <Formik
      enableReinitialize
      initialValues = {initialFields}
      onSubmit={(values) => {
        console.log('submit Clicked')
        console.log(values)
      }}
    >

      {({ values,handleSubmit }) =>
        <Form onSubmit = {handleSubmit}>
          <Form.Group >
            <DateInputFiled label = "Shift Start Time" name='startTime' ></DateInputFiled>
            <DateInputFiled label = "Shift End Time" name='endTime' ></DateInputFiled>
          </Form.Group>

          <Header as="h3">Staffs</Header>

          <FieldArray name="staffs">
            {({ remove, push, replace }) => (
              <>
                <Segment.Group>

                  { values.staffs.length >0 && values.staffs.map((staff,index) =>
                    <Segment basic key= {index}>
                      <Form.Group >
                        <InputFiled disabled= {staff.signedOffKey? true:false } name={`staffs[${index}].name`}></InputFiled>

                        <InputFiled type='hidden' value="" name={`staffs[${index}].signedOffKey`}></InputFiled>
                        < DateInputFiled disabled= {staff.signedOffKey && !staff.changing? true:false } name = {`staffs[${index}].startTime`}/>
                        < DateInputFiled disabled= {staff.signedOffKey  && !staff.changing?  true:false } name = {`staffs[${index}].endTime`}/>
                        <Button
                          disabled= {staff.signedOffKey  && !staff.changing? true:false }
                          circular
                          icon='cancel'
                          basic
                          onClick = {() => {
                            remove(index)
                          }
                          }></Button>

                        {staff.signedOffKey && !staff.changing &&
                      <>
                        <Button
                          inverted
                          color='red'
                          size="small"
                          onClick = {() => {
                            replace(index, { ...staff, changing: true })
                          }
                          }> Change</Button>
                        <Label attached='top left' size='mini' basic color="grey" >Signed Off </Label>
                      </> }


                        {staff.signedOffKey && staff.changing &&
                      <>
                        <Button
                          inverted
                          color='green'
                          size="small"
                          onClick = {() => {
                            replace(index, { ...staff, changing: false })
                          }
                          }> Save </Button>
                        <Label attached='top left' size='mini' basic color="grey" >Signed Off </Label>
                      </> }


                        {!staff.signedOffKey &&
                      <Button
                        inverted  primary
                        onClick = {() => {
                          replace(index, { ...staff, signedOffKey:'testKey' })
                          console.log(values.staffs[index])
                        }
                        } > Sign Off</Button> }
                      </Form.Group>
                    </Segment>
                  )

                  }
                </Segment.Group>
                <Button icon primary onClick={ () => push({ name:'',startTime:'',endTime:'' })}> <Icon name="plus circle"/> Add </Button></>
            )}

          </FieldArray>



          {station.costumers.map(costumer =>
            <Fragment key= {costumer.id }>
              <Header as="h3">Work Performed for {costumer.name}</Header>


              {costumer.aircrafts.map(aircraft =>
                <>
                  <AircraftCheckBox
                    label = {aircraft.registration}
                    key={aircraft.id}
                    checked = {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['checked']}
                    disabled = {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['disbleCheck']}
                    onChange={
                      (e,{ checked }) =>  {
                        e.preventDefault()
                        setCheckedAircrafts({ ...checkedAircrafts,[aircraft.registration]:{ 'checked':checked } })
                      }

                    }>
                    {checkedAircrafts[aircraft.registration]&& checkedAircrafts[aircraft.registration]['checked'] &&
                       <FieldArray name={`tasks.${aircraft.registration}`}>
                         {({ push,remove }) => (<>
                           {!values.tasks[aircraft.registration]?push({ description:'',status:'' }):''}
                           {values.tasks[aircraft.registration] && values.tasks[aircraft.registration].map((task,index) =>
                             <TaskDescriptionField
                               label= {index}
                               taskName = {`tasks.${aircraft.registration}.${index}`}
                               name={`tasks.${aircraft.registration}.${index}.description`}
                               //The input filed is disabled if the task is open for deffered from previous shifts implied by task.id field
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
                               <TextAreaField style= {{ paddingBotton:'5px' }} name={`tasks.${aircraft.registration}.${index}.newUpdate.note` }/>
                             </TaskDescriptionField>


                           )}
                           <Button
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

                </>
              )}


            </Fragment>)}

          <Header as="h3">Work Performed for Other Costumer</Header>
          <Button icon primary><Icon name="plus circle"/> Add </Button>

          <Header as="h3">Other Tasks</Header>
          <Button icon primary><Icon name="plus circle"/> Add </Button>

          <Header as="h3">Logistics</Header>
          <Button icon primary><Icon name="plus circle"/> Add </Button>



          <Button  primary type="submit"> Submit Report </Button>
        </Form> }

    </Formik>

  )
}

export default NewReport