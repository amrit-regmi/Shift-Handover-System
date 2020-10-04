import React,{ useState, useContext, useReducer, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SHIFT_REPORT } from '../../queries/shiftReportQuery'
import { useParams, Redirect, useHistory } from 'react-router-dom'
import { Loader,Image,Segment, Header } from 'semantic-ui-react'
import MenuBar from './MenuBar'
import ShiftReport from '../ShiftReport'
import NewReportShiftSelectModel from './NewReportShiftSelectModel'
import Context from './Context'
import reducer from './stationReducer'
import { GET_STATION } from '../../queries/stationQuery'
import NewReportForm from './NewReportForm'


const StationReportPage = () => {
  const history = useHistory()

  const initialState = useContext(Context)
  const [state,dispatch] = useReducer(reducer, initialState)


  if(!JSON.parse( sessionStorage.getItem('stationKey'))){
    history.push('/')
  }

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

  const useMultipleQuery = () => {
    const res1 = useQuery(GET_SHIFT_REPORT,{ variables:queryParams })
    const res2 = useQuery(GET_STATION,{ variables:{ id: id } })
    return [res1, res2]
  }

  const [
    { loading:loadingReport, error:errorReport, data: dataReport },
    {  data: dataStation }
  ] = useMultipleQuery()

  useEffect(() => {
    if(dataStation) dispatch({ type:'INIT_STATION',payload:dataStation.getStation })
  },[dataStation])

  useEffect(() => {
    if(dataReport) dispatch({ type:'',payload:dataReport.getShiftReport })
  },[dataReport])

  //const { loading:loadingReport, error:errorReport, data: dataReport } = useQuery(GET_SHIFT_REPORT,{ variables:queryParams })


  if (loadingReport) {
    return (
      <Loader active>Fetching Data</Loader>
    )
  }



  if (errorReport) return `Error! ${errorReport}`

  console.log(dataReport.getShiftReport.id)

  return (
    <>
      <Context.Provider value={{ state, dispatch }}>
        <Segment  basic>
          <Header textAlign ="right" color ="blue" floated="right">Shift Reporting System <br/><span><h5> Station: {dataStation && dataStation.getStation.location} </h5></span></Header>
          <Image src='\LogoBig.png' size="medium" />
        </Segment>

        <MenuBar activeItem= {activeItem} setActiveItem={setActiveItem}/>

        { activeItem === 'lastShiftReport' &&
          <ShiftReport reportData= {dataReport.getShiftReport} />
        }

        {activeItem === 'startNewReport'&&
          //<NewReportShiftSelectModel  stationId={id} ></NewReportShiftSelectModel>
          <NewReportForm reportData = {dataReport.getShiftReport}  ></NewReportForm>
        }
      </Context.Provider>
    </>
  )
}

export default StationReportPage

