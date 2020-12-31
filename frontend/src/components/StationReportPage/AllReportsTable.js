import { useQuery } from '@apollo/client'
import React ,{ Fragment, useContext, useState } from 'react'
import { Table,Loader, Header, List } from 'semantic-ui-react'
import { GET_REPORTLIST } from '../../queries/shiftReportQuery'
import Context from './Context'
import _ from 'lodash'

import ReportViewModal from '../ShiftReport/ReportViewModal'


const AllReportsTable = () => {
  const context = useContext(Context)
  const station = context.state.station

  const { error,loading,data } = useQuery(GET_REPORTLIST, { variables:{ stationId: station.id } })
  const [openReport,setOpenReport]= useState({ id:'', open: false })

  let transformData
  if(data) {
    transformData = { ...data.getReportList }
    transformData = _.groupBy(transformData, report => report.startTime.split(' ')[0] )
    transformData = _.mapValues(transformData, date => _.groupBy(date,report => report.station.location))

  }

  if (loading) {
    return (
      <Loader active>Initiatilizing reporting</Loader>
    )
  }

  if (error) {
    console.log(error)
    return (
      <Header as ='h5'>Something Went Wrong, Please try again</Header>
    )
  }

  return (
    <>
      <Table  compact celled striped structured>
        <Table.Header>
          <Table.Row><Table.HeaderCell> Date </Table.HeaderCell><Table.HeaderCell textAlign='center'> Station </Table.HeaderCell><Table.HeaderCell> Shift </Table.HeaderCell></Table.Row>
        </Table.Header>
        <Table.Body>
          {transformData && _.map(transformData,(stations,date) =>
            <Fragment key = {date}>
              {Object.entries(stations).map(([station,reports],index) =>
                <Table.Row  key = {station}>
                  {index === 0 && <Table.Cell collapsing rowSpan={Object.keys(transformData[date]).length}>{date}</Table.Cell>}
                  <Table.Cell textAlign='center' >{station}</Table.Cell>
                  <Table.Cell>
                    <List horizontal>
                      {_.map(reports, report =>
                        <List.Item as = 'a' key={report.id}
                          onClick = {() => {
                            setOpenReport({ id: report.id,open:true })
                          }}>{report.shift}
                        </List.Item>)}
                    </List>
                  </Table.Cell>
                </Table.Row>
              )
              }</Fragment>
          )
          }
        </Table.Body>
      </Table>
      <ReportViewModal setOpenReport= {setOpenReport} openReport={openReport}></ReportViewModal>
    </>
  )
}

export default AllReportsTable