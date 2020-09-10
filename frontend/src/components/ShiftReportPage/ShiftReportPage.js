import React from 'react'
import { useQuery } from '@apollo/client'
import { GET_SHIFT_REPORT } from '../../queries/shiftReportQuery'
import { useParams } from 'react-router-dom'
import { Loader,Image,Segment, Header } from 'semantic-ui-react'
import MenuBar from './MenuBar'
import ShiftReport from './ShiftReport'


const ShiftReportPage = () => {
  const params = useParams()
  const id =params.id
  const station = params.station

  let queryParams
  if (station && id ){
    queryParams = {
      station: id,
      flag:'MOST_RECENTLY_COMPLETED'
    }
  }else{
    queryParams = { id:id }
    console.log('only id set')
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
        <Image src='\LogoBig.png' size="medium" />
        <Header textAlign ="right" color ="blue"  dividing >Shift Reporting System </Header>
      </Segment>

      <MenuBar/>
      <ShiftReport reportData= {data.getShiftReport} />
    </>
  )

}

export default (ShiftReportPage)

