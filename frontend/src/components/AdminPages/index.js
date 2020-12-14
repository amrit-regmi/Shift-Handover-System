import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import StaffPage from '../StaffPage'
import AllStaffs from './AllStaffs'
import AllStations from './AllStations'
import StationInfo from '../StationInfo/Index'
import AdminMenuBar from './AdminMenuBar'
import ManageTimeSheets from './ManageTimeSheets'
import Costumers from './Costumers'
import CostumerInfo from '../CostumerInfo'
//import AllStaffs from '../../AdminPages/AllStaffs'
//import AllStations from '../../AdminPages/AllStations'

//import TimeSheetsOverview from '../../TimeSheetsOverview'


const AdminPages = () => {
  const params = useParams()
  const location = useLocation()

  const basePage =  location.pathname.split('/')[2] //root page

  const [activeItem, setActiveItem] = useState(basePage)

  useEffect(() => {
    setActiveItem(basePage)}
  ,[basePage, location, params])


  return (
    <>
      <AdminMenuBar activeItem={activeItem} setActiveItem= {setActiveItem}></AdminMenuBar>
      {/**If submenu is timesheetsoverview and staffId is set Or current page is managetimesheets or  timesheetsoverview*/
        activeItem && activeItem.toLowerCase() === 'managetimesheets' &&
        <ManageTimeSheets />
      }

      { /**If current page is allStaffs and staffId value is not set */
        activeItem.toLowerCase() === 'mypage' &&
      <>
        <StaffPage />
      </>
      }
      { /**If current page is allStaffs and staffId value is not set */
        activeItem.toLowerCase() === 'allstaffs' && !params.staffId &&
      <>
        <AllStaffs/>
      </>
      }
      { /**If current page is allStaffs and staffId value is set */
        activeItem.toLowerCase() === 'allstaffs' && params.staffId &&
      <>
        <StaffPage id={params.staffId}/>
      </>
      }
      { /**If current page is allStations and stationId value is not set */
        activeItem && activeItem.toLowerCase() === 'allstations' && !params.stationId &&
      <>
        <AllStations/>
      </>
      }
      { /**If current page is allStations and stationId value is set */
        activeItem && activeItem.toLowerCase() === 'allstations' && params.stationId &&
      <>
        <StationInfo/>
      </>
      }
      { /**If current page is allStations and stationId value is not set */
        activeItem && activeItem.toLowerCase() === 'costumers' && !params.id &&
      <>
        <Costumers/>
      </>
      }
      { /**If current page is allStations and stationId value is set */
        activeItem && activeItem.toLowerCase() === 'costumers' && params.id &&
      <>
        <CostumerInfo/>
      </>
      }
    </>
  )
}

export default AdminPages