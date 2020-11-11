import React,{ useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection, Menu } from 'semantic-ui-react'
import ManageTimeSheets from './AdminPages/ManageTimeSheets'
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
  let page = params && params.page
  const location = useLocation()
  const history = useHistory()
  const [staffName, setStaffName] = useState(name)
  const [editModelOpen,setEditModelOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(page || 'Profile')

  const staff = JSON.parse( sessionStorage.getItem('staffKey'))


  if(location.pathname.split('/')[1] === 'ManageTimesheets'){
    page = 'ManageTimesheets'
  }

  useEffect(() => {
    setActiveItem(page)
  },[page])



  /**If user is not logged in */
  if(!staff){
    history.push('/staffLogin')
    return null
  }
  const staffCanEdit  = (staff.id !== staffId && staffId !== undefined)  && ((staff.permission && staff.permission.staff.edit) ||  staff.permission.admin || false)

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

  const getBreadCrumb = () => {
    const basePage =  location.pathname.split('/')[1].toLocaleLowerCase()
    return(
      /**
         * If the staff page is page of browsing user then reflect that info on breadcrumb
         */
      basePage === 'staff' && staff.id === staffId ?
        <Breadcrumb>
          <BreadcrumbSection> My Page </BreadcrumbSection>
          <BreadcrumbDivider/>
          <BreadcrumbSection> {page} </BreadcrumbSection>

        </Breadcrumb> :

        basePage === 'allstaffs' ?
          <>
            { params.id &&
            <>
              <Breadcrumb>
                <BreadcrumbSection link as = {Link} to = {'/AllStaffs'}> All Staffs </BreadcrumbSection>
                <BreadcrumbDivider/>
                <BreadcrumbSection link as={Link} to={`/AllStaffs/${staffId}/Profile`}> {staffName || staffId} </BreadcrumbSection>
                <BreadcrumbDivider/>
                <BreadcrumbSection active> {page} </BreadcrumbSection>
              </Breadcrumb>
            </>
            }


          </> :

          basePage === 'managetimesheets' ?
            <>
              { params.staffId &&
              <Breadcrumb>
                <BreadcrumbSection link as = {Link} to = {'/ManageTimesheets'}> Manage Timesheets </BreadcrumbSection>
                <BreadcrumbDivider/>
                <BreadcrumbSection active = {params.period? false: true}  as={params.period?  Link: ''} to={`/ManageTimesheets/${params.staffId}`}> {staffName || params.staffId} </BreadcrumbSection>
                {params.period && <>
                  <BreadcrumbDivider icon='right chevron'/>
                  <BreadcrumbSection active>{params.period.replace('_',' ')}</BreadcrumbSection>
                </>}
              </Breadcrumb> }
            </> :''


    )

  }


  return (
    <>
      <StaffMenuBar staffName = {staff && staff.name} activeItem= {activeItem} setActiveItem={setActiveItem}></StaffMenuBar>

      {getBreadCrumb()}

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
      { activeItem && activeItem.toLowerCase() === 'timesheets' && <>
        <TimeSheet staffId ={staffId} setStaffName={setStaffName} />
      </>
      }
      { activeItem && activeItem.toLowerCase() === 'profile' &&
        <>
          <Profile id={staffId} staffCanEdit={staffCanEdit} setEditModelOpen={setEditModelOpen} editModelOpen={editModelOpen} setStaffName={setStaffName}/>
        </>
      }
      { activeItem && activeItem.toLowerCase() === 'managetimesheets' &&
        <>
          <ManageTimeSheets setStaffName={setStaffName}></ManageTimeSheets>
        </>
      }
    </>
  )
}

export default StaffPage