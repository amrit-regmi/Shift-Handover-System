import React, { useState } from 'react'
import { Button, Confirm, Menu } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'


const MenuBar = ({ activeItem, setActiveItem }) => {
  const history = useHistory()
  const [confirmOpen,setConfirmOpen] = useState(false)

  const [navigatingTo, setNavigatingTo] = useState('')

  const CurrentDataLossWarning = () => {
    return (
      <Confirm
        open = {confirmOpen}
        cancelButton = 'I understand that all reporting will be lost, Continue'
        confirmButton ='Cancel and Continue Reporting'
        header='Are You sure?'
        content= 'You are navigationg away from from the reporting page, doing so will result in losing all the inputs on the report page. Do you want to continue?'
        onCancel = {() => {
          setActiveItem(navigatingTo)
          setConfirmOpen(false)
        }}

        onConfirm= {() => {
          setConfirmOpen(false)
        }}
      >
      </Confirm>

    )

  }
  const handleMenuClick = (e, { name }) => {

    if(activeItem === 'startNewReport'){
      setNavigatingTo(name)
      setConfirmOpen(true)
      return
    }

    setActiveItem( name )
    //history.push(activeItem)
  }

  const switchStation = () => {
    localStorage.removeItem('stationKey')
    sessionStorage.removeItem('stationKey')
    history.push('/')
  }

  return (
    <>
      <Menu inverted color="blue" stackable >
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

        <Menu.Item name= "stationInfo"
          active = {activeItem === 'stationInfo'}
          onClick = {handleMenuClick}>
        </Menu.Item>

        { /* Will be implemented on future
       <Menu.Item name= "allOpenTasks"
          active = {activeItem === 'allOpenTasks'}
          onClick = {handleMenuClick}>
  </Menu.Item>*/}

        <Menu.Menu position='right'>
          <Button primary
            name='Switch Station '
            active={activeItem === 'logout'}
            onClick={switchStation}
          >Switch Station</Button>
        </Menu.Menu>
      </Menu>
      <CurrentDataLossWarning/>
    </>




  )


}

export default MenuBar