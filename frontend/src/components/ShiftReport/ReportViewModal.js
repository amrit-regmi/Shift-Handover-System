import { useLazyQuery } from '@apollo/client'
import React ,{  } from 'react'
import { Loader, Header, Modal } from 'semantic-ui-react'
import { GET_SHIFT_REPORT } from '../../queries/shiftReportQuery'

import ShiftReport from '.'


const ReportViewModal = ({ openReport,setOpenReport }) => {
  const [getReport,{ error,loading,data }] = useLazyQuery(GET_SHIFT_REPORT)

  const onMount = () => {
    if(openReport.id) {
      getReport({ variables:{ id: openReport.id } })
    } else{
      setOpenReport({ ...openReport,id:'', open: false })
    }


  }

  return (
    <Modal
      onClose={() => setOpenReport({ id:'',open:false })}
      onMount={() => onMount()}
      open= {openReport.open}
    >
      { error &&
      <>
        <Modal.Content> <Header as ='h5'>Oouch...Something Went Wrong, Please try again</Header> </Modal.Content>
      </>
      }
      { loading &&
      <Loader active>Retriving Report</Loader>

      }

      {data && data.getShiftReport &&
      <>
        <Modal.Header>Shift Report: {data.getShiftReport.startTime.split(' ')[0]} {data.getShiftReport.station.location} {data.getShiftReport.shift} shift</Modal.Header>
        <Modal.Content>
          <ShiftReport reportData = {data.getShiftReport}> </ShiftReport>
        </Modal.Content></>
      }
    </Modal>
  )

}

export default ReportViewModal