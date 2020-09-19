import React from 'react'
import { Button, Menu } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'


const MenuBar = ({ activeItem, setActiveItem }) => {

  const history = useHistory()
  const handleMenuClick = (e, { name }) => setActiveItem( name )
  const switchStation = () => {
    localStorage.removeItem('stationKey')
    sessionStorage.removeItem('stationKey')
    history.push('/')
  }

  return (
    <Menu inverted color="blue" >
      <Menu.Item header>  Shift Reporting System </Menu.Item>
      <Menu.Item name= "lastShiftReport"
        active = {activeItem === 'lastShiftReport'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Item name= "browseAllReports"
        active = {activeItem === 'browseAllReports'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Item name= "startNewReport"
        active = {activeItem === 'startNewReport'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Item name= "allOpenTasks"
        active = {activeItem === 'allOpenTasks'}
        onClick = {handleMenuClick}>
      </Menu.Item>

      <Menu.Menu position='right'>
        <Button primary
          name='Switch Station '
          active={activeItem === 'logout'}
          onClick={switchStation}
        >Switch Station</Button>
      </Menu.Menu>
    </Menu>




  )


}

export default MenuBar