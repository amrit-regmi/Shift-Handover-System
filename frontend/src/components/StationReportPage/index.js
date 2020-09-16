import React,{ useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SHIFT_REPORT } from '../../queries/shiftReportQuery'
import { useParams } from 'react-router-dom'
import { Loader,Image,Segment, Header } from 'semantic-ui-react'
import MenuBar from './MenuBar'
import ShiftReport from '../ShiftReport'
import NewReportShiftSelectModel from './NewReportShiftSelectModel'


const StationReportPage = () => {
  const params = useParams()
  const id =params.id
  const station = params.station

  const [activeItem, setActiveItem] = useState('lastShiftReport')


  let queryParams
  if (station && id ){
    queryParams = {
      station: id,
      flag:'MOST_RECENTLY_COMPLETED'
    }
  }

  const { loading, error,data } = useQuery(GET_SHIFT_REPORT,{ variables:queryParams })

  if (loading) {
    return (
      <Loader active>Fetching Data</Loader>
    )
  }


  if (error) return `Error! ${error}`



  return (
    <>
      <Segment  basic>
        <Header textAlign ="right" color ="blue" floated="right">Shift Reporting System <br/><span><h5> Station: {data.getShiftReport.station.location}</h5></span></Header>
        <Image src='\LogoBig.png' size="medium" />
      </Segment>

      <MenuBar activeItem= {activeItem} setActiveItem={setActiveItem}/>

      { activeItem === 'lastShiftReport' &&
      <ShiftReport reportData= {data.getShiftReport} />
      }

      {activeItem === 'startNewReport'&&
      <NewReportShiftSelectModel  stationId={id} ></NewReportShiftSelectModel>
      }
    </>
  )
}

export default StationReportPage

