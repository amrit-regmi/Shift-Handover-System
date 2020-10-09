import React from 'react'
import { Button, Menu } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'


const StaffMenuBar = ({ activeItem, setActiveItem, staffName }) => {

  const history = useHistory()
  const handleMenuClick = (e, { name }) => setActiveItem( name )
  const logout = () => {
    sessionStorage.removeItem('staffKey')
    history.push('/staffLogin')
  }

  return (
    <Menu inverted color="blue" stackable >
      <Menu.Item header> Welcome {staffName} </Menu.Item>

      <Menu.Item name= "Timesheet"
        active = {activeItem === 'Timesheets'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Item name= "SubmittedTimesheets"
        active = {activeItem === 'SubmittedTimesheets'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Item name= "Profile"
        active = {activeItem === 'Profile'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Button primary
          name='Logout '
          active={activeItem === 'logout'}
          onClick={logout}
        >Logout</Button>

        <Button primary
          name='switchToManagementMode'
          active={activeItem === 'switchToManagementMode'}
          onClick={() => {
            /**TO BE IMPLEMENTED */
          }}
        >Switch to Management Mode</Button>
      </Menu.Menu>
    </Menu>




  )


}

export default StaffMenuBar