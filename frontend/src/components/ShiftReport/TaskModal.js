import React from 'react'
import { Header, Label, Modal, Segment } from 'semantic-ui-react'

const TaskModal = (props) => {
  const task = props.task
  return (
    <Modal
      open = {props.open }
      onClose= {() => props.setOpen(false)}
    >
      <Modal.Header> Task Details </Modal.Header>
      <Modal.Content>
        { task.taskCategory ==='AIRCRAFT' &&
          <Segment.Group horizontal>
            <Segment basic attached='top'as ={Header}>Aircraft<Header.Subheader>{task.aircraft.registration}</Header.Subheader></Segment>
            <Segment basic attached='bottom' as ={Header}>Costumer<Header.Subheader>{task.aircraft.costumer.name}</Header.Subheader></Segment>
          </Segment.Group>
        }

        <Segment >
          <Header as ='h3'>Status</Header>
          <p>{task.status}</p>
        </Segment>

        <Segment >
          <Header as ='h3'>Description</Header>
          <p>{task.description}</p>
        </Segment>


        <Segment >
          <Header as ='h3'>Action History</Header>
          <Segment.Group>
            {task.updates.map((update,i) =>
              <Segment clearing key={i}
                color={update.handoverId.id === props.viewingOnHanodover || (!props.viewingOnHanodover && task.updates.length-1 === i ) ?'green':'grey'}
              >
                <Header as='h5'>{update.action}<Header.Subheader>{update.handoverId.station.location} {update.handoverId.shift} shift {update.handoverId.startTime.split(' ')[0]}</Header.Subheader></Header>
                {update.handoverId.id === props.viewingOnHanodover &&
                <Label color='green' attached='top right'> Currently Viewing this Report</Label>}

                {!props.viewingOnHanodover && task.updates.length-1 === i &&
                 <Label color='green' attached='top right'> Last Action Performed</Label>
                }

                {update.note}
              </Segment>


            )}
          </Segment.Group>


        </Segment>
        {/*NOT IMPLEMENTED ON THIS REVISION
        <Segment basic floated='right'>
          <Button primary >Add Notes </Button>
          <Button positive>Close Task </Button>
          <Button negative>Defer Task </Button>
            </Segment>*/}
      </Modal.Content>
    </Modal>
  )

}

export default TaskModal