import React,{ useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Menu } from 'semantic-ui-react'
import Profile from './Profile'
import StaffMenuBar from './StaffMenuBar'
import TimeSheet from './TimeSheet'
/**
 * Staff page component
 * Can receive staffName as props  if props not set then retrives staffId from url nad fetches name
 * @param {staffName,id}
 */
const StaffPage = ({ name ,id }) => {
  const params = useParams()
  let staffId = params && params.id
  const page = params && params.page
  const history = useHistory()
  const [staffName, setStaffName] = useState(name)
  const [editModelOpen,setEditModelOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(page || 'Profile')

  const staff = JSON.parse( sessionStorage.getItem('staffKey'))

  const staffCanEdit  = (staff.id !== staffId && staffId !== undefined)  && ((staff.permission && staff.permission.staff.edit) ||  staff.permission.admin || false)

  useEffect(() => {
    setActiveItem(page)
  },[page])

  const location = useLocation()

  /**If user is not logged in */
  if(!staff){
    history.push('/staffLogin')
    return null
  }

  /**If id is passed as props */
  if(id){
    staffId= id
  }
  /**If the url have staff Id */
  else if(params.id) {
    staffId= params.id
  }
  /**staff is loggedIn user */
  else {
    staffId= staff.id
  }



  if(!staffId){
    staffId = staff.id
  }

  if(id){
    staffId = id
  }


  if(staff.id !== staffId){
    if(location.pathname.split('/')[1] !== 'AllStaffs')
      history.push(`/AllStaffs/${staffId}/${activeItem}`)

  }


  return (
    <>
      <StaffMenuBar staffName = {staff && staff.name} activeItem= {activeItem} setActiveItem={setActiveItem}></StaffMenuBar>
      <Breadcrumb size='mini'>
        {location.pathname.split('/')[1].toLocaleLowerCase() !== 'AllStaffs'.toLowerCase() ?<>
          <BreadcrumbSection> My Page </BreadcrumbSection>
          <BreadcrumbDivider/></>
          :
          <><BreadcrumbSection link> All Staffs </BreadcrumbSection>
            <BreadcrumbDivider/>
            <BreadcrumbSection link as={Link} to={`/AllStaffs/${staffName || staffId}/Profile`}> {staffName || staffId} </BreadcrumbSection>
            <BreadcrumbDivider/>
          </>
        }
        <BreadcrumbSection> {page} </BreadcrumbSection>
      </Breadcrumb>
      {staffId !== staff.id &&

<Menu pointing secondary >
  <Menu.Item header>{staffName}</Menu.Item>
  <Menu.Item
    position='right'
    name='Profile'
    active = {activeItem === 'Profile'}
    onClick={() => {
      setActiveItem('Profile')
      history.push('Profile')
    }}
  />

  <Menu.Item
    name='Timesheets'
    active = {activeItem === 'Timesheets'}
    onClick={() => {
      setActiveItem('Timesheets')
      history.push('Timesheets')
    }}
  />

  <Menu.Item
    name='SubmittedTimesheets'
    active = {activeItem === 'SubmittedTimesheets'}
    onClick={() => {
      setActiveItem('SubmittedTimesheets')
      history.push('SubmittedTimesheets')
    }}
  />
  {staffCanEdit &&<Menu.Item
    position='right'
    name='EditProfile'
    icon = 'edit'
    onClick={(e) => {
      e.preventDefault()
      setEditModelOpen(true)
    }}
  />}

</Menu>
      }
      { activeItem === 'Timesheets' && <>
        <TimeSheet staffId ={staffId} setStaffName={setStaffName} />
      </>
      }
      { activeItem === 'Profile' &&
        <>
          <Profile id={staffId} staffCanEdit={staffCanEdit} setEditModelOpen={setEditModelOpen} editModelOpen={editModelOpen} setStaffName={setStaffName}/>
        </>
      }
    </>
  )
}

export default StaffPage