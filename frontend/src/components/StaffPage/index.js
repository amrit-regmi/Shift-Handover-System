import React,{ useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
import { Breadcrumb, BreadcrumbDivider, BreadcrumbSection } from 'semantic-ui-react'
import AdminPages from '../AdminPages'
//import { sub } from '../../../../backend/Src/typeDefs/types/staffType'
import ManageTimeSheets from '../AdminPages/ManageTimeSheets'
import Profile from './Profile'
import RegisterPage from './RegisterPage'
import StaffMenuBar from './StaffMenuBar'
import StaffSubMenu from './StaffSubMenu'
import TimeSheet from './TimeSheet'
/**
 * Staff page component
 * Can receive staffName as props  if props not set then retrives staffId from url nad fetches name
 * @param props {staffName,id}
 */
const StaffPage = ({ name ,id }) => {

  const params = useParams()

  let staffId = params && params.staffId
  let page = params && params.page
  const location = useLocation()
  const history = useHistory()
  const [staffName, setStaffName] = useState(name)

  const [editModelOpen,setEditModelOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(page )
  const [subMenuActiveItem, setSubMenuActiveItem] = useState(page || 'Profile')

  const staff = JSON.parse( sessionStorage.getItem('staffKey'))

  const [loggedInStaffName, setLoggedInStaffName] = useState(staff && staff.name)

  const locationPaths = location.pathname.split('/')

  useEffect(() => {
    setActiveItem(page)
    setSubMenuActiveItem(page)
  },[page])

  /**If the user is trying to register via registration link  */
  if(locationPaths[1].toLowerCase() === 'register'){
    page = 'register'
    return<>
      <StaffMenuBar staffName = {loggedInStaffName} activeItem= {activeItem} setActiveItem={setActiveItem}></StaffMenuBar>
      <RegisterPage setName={setLoggedInStaffName}></RegisterPage></>
  }


  /**If user is not logged in and is not requesting to register */
  if(!staff && page !== 'register'){
    history.push('/staffLogin')
    return null
  }


  const staffCanEdit  = (staff.id !== staffId && staffId !== undefined)  && ((staff.permission && staff.permission.staff.edit) ||  staff.permission.admin || false)
  const staffHasMangeRights =  staff.permission && (staff.permission.station.edit.length > 0 || staff.permission.station.add || staff.permission.staff.view || staff.permission.timesheet.view.length > 0
  )

  /**If id is passed as props then use that as staffId*/
  if(id){
    staffId= id
  }
  /**If the url have staff Id */
  else if(params.staffId) {
    staffId= params.staffId
  }
  /**staff is loggedIn user */
  else {
    staffId= staff.id
  }

  const basePage =  locationPaths[1] //root page
  if(staff.id !== staffId && basePage.toLocaleLowerCase() === 'staff' ){ //if user is not same as logged in user then redirect to manage page
    history.push(`/Manage/AllStaffs/${staffId}/${activeItem}`)
  }

  if(staffHasMangeRights && basePage.toLowerCase() !== 'manage' ){ // if user has manage rights then redirect to manage page
    history.push('/Manage/MyPage/Profile')
  }

  /**
   * Set bredcrumbs for diffent view based on root page
   */

  const getBreadCrumb = () => {

    return(
      <>
        <Breadcrumb>
          { staff.id === staffId &&
            <>
              <BreadcrumbSection> My Page </BreadcrumbSection>
              <BreadcrumbDivider/>
            </>
          }
          {
            staff.id !== staffId &&
            <>
              <BreadcrumbSection link as = {Link} to = {`/${basePage}/${locationPaths[2]}`}> {locationPaths[2]} </BreadcrumbSection>
              <BreadcrumbDivider/>
              <BreadcrumbSection link as={Link} to={`/${basePage}/${locationPaths[2]}/${locationPaths[3]}/Profile`}> {staffName || staffId} </BreadcrumbSection>
              <BreadcrumbDivider/>

            </>
          }
          {
            page && page.toLowerCase()=== 'timesheetsoverview'  && params.period ?
              <>
                <BreadcrumbSection link as={Link}
                  to={
                    locationPaths.reduce ((p,c,i) => {
                      if(i === locationPaths.length -1 || c === ''){
                        return p
                      }
                      return p+'/'+c
                    })}
                  active> {subMenuActiveItem} </BreadcrumbSection>
                <BreadcrumbDivider icon='right chevron'/>
                <BreadcrumbSection active>{params.period.replace('_',' ')}</BreadcrumbSection>
              </>:
              <BreadcrumbSection active> {subMenuActiveItem} </BreadcrumbSection>
          }

        </Breadcrumb>
      </>
    )
  }

  return (
    <>
      {!staffHasMangeRights  && <StaffMenuBar staffName = {loggedInStaffName} activeItem= {activeItem} setActiveItem={setActiveItem}></StaffMenuBar> }
      {getBreadCrumb()}

      {staffId !== staff.id  && //If admin user is browsing staff
      <StaffSubMenu
        activeItem= {subMenuActiveItem}
        setActiveItem = {setSubMenuActiveItem}
        staffName= {staffName} staffId={staffId}
        staffCanEdit={staffCanEdit}
        setEditModelOpen = {setEditModelOpen}/>
      }

      { /**If submenu is timesheets  Or current page is timesheet */
        ((subMenuActiveItem &&subMenuActiveItem.toLocaleLowerCase() === 'timesheets' )|| (activeItem && activeItem.toLowerCase() === 'timesheets')) && <>
          <TimeSheet staffId ={staffId} setStaffName={setStaffName} />
        </>
      }
      {/**If submenu is profile Or current page is profile */
        ((subMenuActiveItem && subMenuActiveItem.toLocaleLowerCase() === 'profile' ) || ( activeItem && activeItem.toLowerCase() === 'profile') )&&
        <>
          <Profile id={staffId} staffCanEdit={staffCanEdit} setEditModelOpen={setEditModelOpen} editModelOpen={editModelOpen} setStaffName={setStaffName}/>
        </>
      }
      {/**If submenu is timesheetsoverview  current page is managetimesheets or  timesheetsoverview*/
        ((subMenuActiveItem && subMenuActiveItem.toLocaleLowerCase() === 'timesheetsoverview' ) || (activeItem && ( activeItem.toLowerCase() === 'timesheetsoverview'))) &&
        <>
          <ManageTimeSheets setName={setStaffName}></ManageTimeSheets>
        </>
      }
    </>
  )
}

export default StaffPage