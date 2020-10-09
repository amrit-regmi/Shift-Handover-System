import React,{ useState } from 'react'
import { useHistory } from 'react-router-dom'
import StaffMenuBar from './StaffMenuBar'

const StaffPage = () => {
  const [activeItem, setActiveItem] = useState('workTimeOverview')
  const history = useHistory()

  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  /**If user is not logged in */
  if(!staff){
    history.push('/staffLogin')
  }

  return (
    <StaffMenuBar staffName = {staff && staff.name} activeItem= {activeItem} setActiveItem={setActiveItem}></StaffMenuBar>
  )
}

export default StaffPage