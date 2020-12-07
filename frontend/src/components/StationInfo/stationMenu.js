import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const StationMenu = ({ stationLocation ,activeItem, setActiveItem }) => {
  const history = useHistory()


  const handleMenuClick = (e, { name }) => {
    setActiveItem(name)
    if(activeItem !== name){
      history.push(name)
    }

  }
  return (
    <Menu pointing secondary >
      <Menu.Item header>{stationLocation}</Menu.Item>
      <Menu.Item
        position='right'
        name='BasicInfo'
        active = {activeItem === 'BasicInfo'}
        onClick={handleMenuClick}
      />

      <Menu.Item
        name='Procedures'
        active = {activeItem === 'Procedures'}
        onClick={handleMenuClick}
      />

      <Menu.Item
        name='Costumers'
        active = {activeItem === 'Costumers'}
        onClick={handleMenuClick}
      />

      <Menu.Item
        name='Settings'
        active = {activeItem === 'Settings'}
        onClick={handleMenuClick}
      />
    </Menu>

  )}

export default StationMenu