import React from 'react'
import { Dropdown, Menu } from 'semantic-ui-react'
import { useHistory, useLocation } from 'react-router-dom'


const StaffMenuBar = ({ staffName, activeItem, setActiveItem }) => {
  const staff = JSON.parse( sessionStorage.getItem('staffKey'))
  const history = useHistory()

  const location = useLocation()

  if(location.pathname.split('/')[1].toLowerCase() === 'register'){
    return (

      <Menu inverted color="blue" stackable >
        <Menu.Item position='right'>
          Welcome {staffName}
        </Menu.Item>
      </Menu>
    )

  }


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


  const cornerButton = () => {
    return (
      <Dropdown item text = {`Welcome ${staff.name}` } >
        <Dropdown.Menu>
          <Dropdown.Item text='Logout' onClick={() => logout()}/>
        </Dropdown.Menu>
      </Dropdown>
    )
  }

  /** Add Items to Menu*/
  if (menuItems.length === 0) {
    menuItems.push('Timesheets')
    menuItems.push('TimesheetsOverview')
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