import React from 'react'
import { Button, Dropdown, Menu } from 'semantic-ui-react'
import { useHistory, useParams } from 'react-router-dom'


const StaffMenuBar = ({ activeItem, setActiveItem }) => {
  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  const history = useHistory()

  const handleMenuClick = (e, { name }) => {
    setActiveItem( name )
    if( ['Profile','Timesheets','TimesheetsOverview'].includes(name) ){
      history.push(`/staff/${staff.id}/${name}`)
    }else{
      history.push(`/${name}`)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('staffKey')
    history.push('/staffLogin')
  }

  const menuItems = []

  /**If user has some admin rights then add those items to menu and own profile view will be on dropdown Button */
  if(staff.permission.station.edit.length > 0 || staff.permission.station.add){
    menuItems.push ('AllStations')
  }

  if(staff.permission.staff.view){
    menuItems.push ('AllStaffs')
  }

  if(staff.permission.timesheet.view.length > 0){
    menuItems.push ('ManageTimesheets')
  }

  const cornerButton = () => {
    return (
      <Dropdown item text = {`Welcome ${staff.name}` } >
        <Dropdown.Menu>
          {menuItems.length > 0 && <>
            <Dropdown.Item disabled text='My Pages'  onClick = { handleMenuClick }/>
            <Dropdown.Item name= 'Profile' text='Profile'  onClick = { handleMenuClick }/>
            <Dropdown.Item name ='Timesheets' text='Timesheets'  onClick = { handleMenuClick }/>
            <Dropdown.Item name = 'TimesheetsOverview' text='TimesheetsOverview'  onClick = { handleMenuClick }/>
            <Dropdown.Divider/>

          </>
          }
          <Dropdown.Item text='Logout' onClick={() => logout()}/>

        </Dropdown.Menu>

      </Dropdown>
    )
  }

  /** If user doesnot have any admin rights then */
  if (menuItems.length === 0) {
    menuItems.push('Timesheets')
    menuItems.push('SubmittedTimesheets')
    menuItems.push('Profile')
  }


  const getMenuItems = () => {
    return menuItems.map(item =>
      <Menu.Item  key={ item} name = {item} active = {activeItem ===  item }
        onClick = {handleMenuClick} />)

  }


  return (
    <Menu inverted color="blue" stackable >

      {getMenuItems()}
      <Menu.Menu position='right'>
        {cornerButton()}
      </Menu.Menu>
    </Menu>




  )


}

export default StaffMenuBar