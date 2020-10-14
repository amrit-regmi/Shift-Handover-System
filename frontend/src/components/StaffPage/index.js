import React,{ useState } from 'react'
import { useHistory } from 'react-router-dom'
import StaffMenuBar from './StaffMenuBar'
import TimeSheet from './TimeSheet'

const StaffPage = () => {
  const [activeItem, setActiveItem] = useState('Timesheets')
  const history = useHistory()

  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  /**If user is not logged in */
  if(!staff){
    history.push('/staffLogin')
  }

  return (
    <>
      <StaffMenuBar staffName = {staff && staff.name} activeItem= {activeItem} setActiveItem={setActiveItem}></StaffMenuBar>
      { activeItem === 'Timesheets' &&
      <TimeSheet/>
      }
    </>
  )
}

export default StaffPage