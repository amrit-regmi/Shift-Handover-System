import React,{ useState, useContext, useReducer, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { GET_SHIFT_REPORT } from '../../queries/shiftReportQuery'
import { useParams, useHistory } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import MenuBar from './MenuBar'
import ShiftReport from '../ShiftReport'
import Context from './Context'
import reducer from './stationReducer'
import { GET_STATION } from '../../queries/stationQuery'
import NewReportForm from './NewReportForm'
import { NotificationContext } from '../../contexts/NotificationContext'
import StationInfo from '../StationInfo/Index'
import ShiftReportsList from '../ShiftReportsList'


const StationReportPage = () => {
  const history = useHistory()

  const initialState = useContext(Context)
  const [state,dispatch] = useReducer(reducer, initialState)

  const [,notificationDispatch] = useContext(NotificationContext)

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
    const res1 = useQuery(GET_SHIFT_REPORT,{
      variables:queryParams,
      onError: (err) => notificationDispatch({ type:'ADD_NOTIFICATION',  payload:{ content: err.message ,type: 'ERROR' } }) })
    const res2 = useQuery(GET_STATION,{ variables:{ id: id } })
    return [res1, res2]
  }

  const [
    { loading:loadingReport, data: dataReport },
    {  data: dataStation }
  ] = useMultipleQuery()

  useEffect(() => {
    if(dataStation) dispatch({ type:'INIT_STATION',payload:dataStation.getStation })
  },[dataStation])

  useEffect(() => {
    if(dataReport) dispatch({ type:'ADD_LASTSHIFTREPORT',payload:dataReport.getShiftReport })
  },[dataReport])

  //const { loading:loadingReport, error:errorReport, data: dataReport } = useQuery(GET_SHIFT_REPORT,{ variables:queryParams })



  if (loadingReport) {
    return (
      <Loader active>Fetching Data</Loader>
    )
  }

  return (
    <>
      <Context.Provider value={{ state, dispatch }}>

        <MenuBar activeItem= {activeItem} setActiveItem={setActiveItem}/>

        { activeItem === 'lastShiftReport' &&
          <ShiftReport reportData= {dataReport && dataReport.getShiftReport}  />
        }
        { activeItem === 'browseAllReports' &&
          <ShiftReportsList  />
        }

        {activeItem === 'startNewReport'&&
          //<NewReportShiftSelectModel  stationId={id} ></NewReportShiftSelectModel>
          <NewReportForm  setActiveItem={setActiveItem}></NewReportForm>
        }

        {activeItem === 'stationInfo'&&
          //<NewReportShiftSelectModel  stationId={id} ></NewReportShiftSelectModel>
          <StationInfo stationId={id}></StationInfo>
        }
      </Context.Provider>
    </>
  )
}

export default StationReportPage

