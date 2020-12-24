import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const StaffSubMenu = ({  activeItem, setActiveItem ,staffName, staffId ,staffCanEdit ,setEditModelOpen }) => {
  const loggedInStaffPermissions = JSON.parse( sessionStorage.getItem('staffKey')).permission
  const history = useHistory()
  useEffect(() => {
    setActiveItem('')
    return () => setActiveItem('')
  },[setActiveItem])
  return (
    <Menu pointing secondary >
      <Menu.Item header>{staffName}</Menu.Item>
      <Menu.Item
        position='right'
        name='Profile'
        active = {activeItem === 'Profile'}
        onClick={() => {
          setActiveItem('Profile')
          history.push(`/Manage/AllStaffs/${staffId}/Profile`)
        }}
      />

      {(loggedInStaffPermissions.admin || loggedInStaffPermissions.timesheet.view.length || loggedInStaffPermissions.timesheet.sign.length) === true  &&
        <>
          <Menu.Item
            name='Timesheets'
            active = {activeItem === 'Timesheets'}
            onClick={() => {
              setActiveItem('Timesheets')
              history.push(`/Manage/AllStaffs/${staffId}/Timesheets`)
            }}
          />


          <Menu.Item
            name='TimesheetsOverview'
            active = {activeItem === 'TimesheetsOverview'}
            onClick={() => {
              setActiveItem('TimesheetsOverview')
              history.push(`/Manage/AllStaffs/${staffId}/TimesheetsOverview`)


            }}
          />
        </>}
      {staffCanEdit &&<Menu.Item
        position='right'
        name='EditProfile'
        icon = 'edit'
        onClick={(e) => {
          e.preventDefault()
          history.push('Profile')
          setActiveItem('Profile')
          setEditModelOpen(true)
        }}
      />}

    </Menu>

  )}

export default StaffSubMenu