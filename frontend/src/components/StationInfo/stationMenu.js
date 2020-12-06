import React, { useState } from 'react'
import { Menu } from 'semantic-ui-react'

const StationMenu = ({ stationLocation }) => {
  const [activeItem,setActiveItem] = useState('BasicInfo')
  return (
    <Menu pointing secondary >
      <Menu.Item header>{stationLocation}</Menu.Item>
      <Menu.Item
        position='right'
        name='BasicInfo'
        active = {activeItem === 'BasicInfo'}
        onClick={() => {
          setActiveItem('BasicInfo')
        }}
      />

      <Menu.Item
        name='CurrentStaffs'
        active = {activeItem === 'CurrentStaffs'}
        onClick={() => {
          setActiveItem('CurrentStaffs')
        }}
      />

      <Menu.Item
        name='Procedures'
        active = {activeItem === 'Procedures'}
        onClick={() => {
          setActiveItem('CurrentStaffs')
        }}
      />

      <Menu.Item
        name='Costumers'
        active = {activeItem === 'Costumers'}
        onClick={() => {
          setActiveItem('Costumers')
        }}
      />

      <Menu.Item
        name='Settings'
        active = {activeItem === 'Settings'}
        onClick={() => {
          setActiveItem('Settings')
        }}
      />
    </Menu>

  )}

export default StationMenu