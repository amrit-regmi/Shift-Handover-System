import React ,{ useState } from 'react'
import ShiftReportFilter from './ShiftReportFilter'
import ReportsTable from './ReportsTable'

const ShiftReportsList = () => {

  const [filter,setFilter] = useState({
    slectBy:'',
    number:'',
    stations:[],
  })


  return (
    <>
      <ShiftReportFilter setFilter={setFilter}></ShiftReportFilter>
      <ReportsTable filter={filter}></ReportsTable>
    </>
  )
}

export default ShiftReportsList