import React, { useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const StationMenu = ({ station ,activeItem, setActiveItem }) => {
  const history = useHistory()

  const location = useLocation()

  const navigatePath = (page) => {
    const aar = location.pathname.split('/').filter(path => path !== '')

    const navPath = aar.reduce((p,c,i) => {
      if(c === activeItem || aar.length- 1 === i){ //If the current item on iteration is current page exit reduce
        aar.splice(1)
        return p
      }
      return p+'/'+c
    },'')

    return navPath+'/'+page
  }

  const handleMenuClick = (e, { name }) => {
    setActiveItem(name)
    if(activeItem !== name){
      history.push(navigatePath(name))
    }

  }
  return (
    <Menu pointing secondary >
      <Menu.Item header>{station.location}</Menu.Item>
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