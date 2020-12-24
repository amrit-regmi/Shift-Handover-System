import React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'


const AdminMenuBar = ({  activeItem, setActiveItem }) => {
  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  const history = useHistory()
  const handleMenuClick = (e, { name }) => {
    setActiveItem( name )

    if( ['Profile','Timesheets','TimesheetsOverview'].includes(name) ){ /** If user views personal pages */
      history.push(`/Manage/MyPage/${name}`)
    }else{
      history.push(`/Manage/${name}`)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('staffKey')
    history.push('/staffLogin')
  }

  const menuItems = []

  /**If user has some admin rights then add those items to menu and own profile options view will be on dropdown Button */
  if(staff.permission.admin || staff.permission.station.edit.length > 0 || staff.permission.station.add){
    menuItems.push ('AllStations')
  }

  if(staff.permission.admin || staff.permission.staff.view || staff.permission.staff.add  || staff.permission.staff.view || staff.permission.staff.edit){
    menuItems.push ('AllStaffs')
  }

  if(staff.permission.admin || staff.permission.timesheet.view.length > 0){
    menuItems.push ('ManageTimesheets')
  }

  if(staff.permission.admin){
    menuItems.push ('Costumers')
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
      </Menu.Menu>
    </Menu>
  )


}

export default AdminMenuBar