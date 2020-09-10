import React from 'react'
import { Segment, Table } from 'semantic-ui-react'

const StaffWorkTime = ({ timesheets }) => {
  return(
    <Segment>
      <Table celled >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Staff</Table.HeaderCell>
            <Table.HeaderCell>Start Time</Table.HeaderCell>
            <Table.HeaderCell>End TIme</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {timesheets.map(timesheet =>
            <Table.Row key={timesheet.id}>
              <Table.Cell>{timesheet.staff.name}</Table.Cell>
              <Table.Cell>{timesheet.startTime.substring(10)}</Table.Cell>
              <Table.Cell>{timesheet.endTime.substring(10)}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>

      </Table>

    </Segment>

  )

}

export default StaffWorkTime