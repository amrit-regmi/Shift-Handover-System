import React ,{ Fragment, useEffect, useState } from 'react'
import { Table,Loader, List, Header, Message } from 'semantic-ui-react'
import _ from 'lodash'

import ReportViewModal from '../ShiftReport/ReportViewModal'
import { useQuery } from '@apollo/client'
import { GET_REPORTLIST } from '../../queries/shiftReportQuery'
import { getFilterYear } from '../../utils/DateHelper'


const ReportsTable = ({ filter }) => {

  const [transformedData, setTransformedData ] = useState()
  const [openReport,setOpenReport]= useState({ id:'', open: false })


  const variables = { ...filter }

  variables.year = getFilterYear(filter.filterBy, filter.number)
  const { error,data, loading } = useQuery(GET_REPORTLIST, { variables: variables, skip : !(variables.stations.length && variables.year && !isNaN(variables.number)) })

  useEffect(() => {
    if(data) {
      let transformingData
      transformingData = { ...data.getReportList }
      transformingData = _.groupBy(transformingData, report => report.startTime.split(' ')[0] )
      transformingData = _.mapValues(transformingData, date => _.groupBy(date,report => report.station.location))
      setTransformedData(transformingData)
    }

  }, [data])

  if (error) {
    return (
      <Message error>
        <Header as ='h5'>Something Went Wrong, Please try again</Header>
      </Message>
    )
  }
  if (loading ) {
    return (
      <Loader active>Fetching Reports</Loader>
    )
  }

  if(data && !data.getReportList.length){
    return <Header as='h5'> No reports found</Header>
  }

  if(!variables.stations.length){
    return <Message ><Header textAlign='center' as='h5'> No station selected. Please select a station</Header></Message>
  }


  return (

    <>
      { transformedData &&
       <Table  compact celled striped structured>
         <Table.Header>
           <Table.Row><Table.HeaderCell> Date </Table.HeaderCell><Table.HeaderCell textAlign='center'> Station </Table.HeaderCell><Table.HeaderCell> Shift </Table.HeaderCell></Table.Row>
         </Table.Header>
         <Table.Body>
           {transformedData && _.map(transformedData,(stations,date) =>
             <Fragment key = {date}>
               {Object.entries(stations).map(([station,reports],index) =>
                 <Table.Row  key = {station}>
                   {index === 0 && <Table.Cell collapsing rowSpan={Object.keys(transformedData[date]).length}>{date}</Table.Cell>}
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
       </Table>}
      <ReportViewModal setOpenReport= {setOpenReport} openReport={openReport}></ReportViewModal>
    </>
  )
}

export default ReportsTable