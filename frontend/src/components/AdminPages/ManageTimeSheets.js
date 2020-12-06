import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'
import TimeSheetsOverview from '../TimeSheetsOverview'

const ManageTimeSheets = ({ setName , }) => {
  const params = useParams()
  const [staffName, setStaffName ] = useState('')

  return <>
    { /** If current page is not timesheetsoverview then show breadcrumbs*/
      !(params.page && params.page.toLowerCase() === 'timesheetsoverview') &&
      <>
        <Breadcrumb>
          { /**If currentpage is overview page of a staff or period is set on params */
            (params.staffId) &&
            <>
              <Breadcrumb.Section link as = {Link} to = {'/Manage/ManageTimesheets'}> Manage Timesheets </Breadcrumb.Section>
              <Breadcrumb.Divider/>
              <Breadcrumb.Section active = {params.period? false: true}  as={params.period?  Link: ''} to={`/Manage/ManageTimesheets/${params.staffId}`}> {staffName } </Breadcrumb.Section>
            </>
          }
          {params.period && <>
            <Breadcrumb.Divider icon='right chevron'/>
            <Breadcrumb.Section active>{params.period.replace('_',' ')}</Breadcrumb.Section>
          </>}
        </Breadcrumb>
      </>
    }

    <TimeSheetsOverview setStaffName= { setName || setStaffName } ></TimeSheetsOverview>
  </>

}
export default ManageTimeSheets