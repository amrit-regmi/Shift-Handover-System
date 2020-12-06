import { useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { GET_STATION } from '../../queries/stationQuery'
import StationMenu from './stationMenu'

const StationInfo = (props) => {
  const [stationData, setStationData] = useState('')

  let stationId = useParams().stationId
  /** If stationId is passed as props then passed stationId should have precedence over params */
  if(props.stationId){
    stationId = props.stationId
  }

  const { loading,error } = useQuery(GET_STATION, {
    variables: { id: stationId },
    skip: !stationId,
    onCompleted: (data) => setStationData(data.getStation)
  } )

  if(!stationId || !stationData ){
    return null
  }

  return (
    <StationMenu stationLocation= {stationData.stationLocation} ></StationMenu>
  )


}
export default StationInfo