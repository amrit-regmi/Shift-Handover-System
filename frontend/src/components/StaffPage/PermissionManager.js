import { useMutation, useQuery } from '@apollo/client'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Checkbox, Dimmer, Form, Header,Loader, Table, TableBody } from 'semantic-ui-react'
import _ from 'lodash'
import { ALL_STATION } from '../../queries/stationQuery'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
import { FieldArray, Formik } from 'formik'
import { CHANGE_PERMISSION } from '../../mutations/permissionMutation'


const PermissionManager = ({ permissions }) => {

  const staff =  JSON.parse(sessionStorage.getItem('staffKey'))
  const [superUserSet,setSuperUserSet] = useState((permissions && permissions.admin )|| false)

  const hasSuperPermission = staff.permission.admin

  // console.log(hasSuperPermission,staff ,superUserSet)
  const [updatePermission,{ loading: pLoading, error: pError, data: pData }] = useMutation(CHANGE_PERMISSION)

  const mapPermission = (permssionType,v) => permssionType && permssionType.map(v => {
    if(!v) return null
    return v._id
  })

  /**Generates station option based on user permission
   * User can only assign permsission if the user have rights for the station
   */

  console.log(staff)

  const hasPermission = (permissions) => {
    console.log(staff.permission['timesheet'].sign)
    if(hasSuperPermission){
      return true
    }
    if((typeof permissions === 'object' )) {
      if(!_.isEmpty(permissions)){
        return true
      }
    }  else if(permissions){
      return true
    }
    return false
  }

  const permission = _.mapValues(permissions,(v,k) => {
    if(typeof v === 'object'){
      const mod = { ...v }
      if(k==='station'){
        mod.edit = mapPermission (mod.edit )

      }

      if(k==='timesheet'){
        mod.edit = mapPermission (mod.edit )
        mod.view = mapPermission (mod.view )
        mod.sign = mapPermission (mod.sign)

      }
      return mod

    }
    else return v

  })

  const { loading,data } = useQuery(ALL_STATION,{ skip: !hasSuperPermission })
  const [options,setOptions] = useState([])



  const getStationOptions = (fieldName) => {
    if (hasSuperPermission) {
      return options
    }
    let soptions = []
    switch (fieldName){
    case 'station.edit':
      if(staff.permission.station.edit.length ) {
        soptions= staff.permission.station.edit.map((v,i) => {
          return { key:i, value: v._id, text: v.location }
        })

      }
      return soptions
    case 'timesheet.edit':
      if(staff.permission.timesheet.edit.length ) {
        soptions = staff.permission.timesheet.edit.map((v,i) => {
          return { key:i, value: v._id, text: v.location }
        })

      }
      return soptions
    case 'timesheet.view':
      if(staff.permission.timesheet.view.length ) {
        soptions = staff.permission.timesheet.view.map((v,i) => {
          return { key:i, value: v._id, text: v.location }
        })

      }
      return  soptions
    case 'timesheet.sign':
      if(staff.permission.timesheet.sign.length ) {
        soptions =  staff.permission.timesheet.sign.map((v,i) => {
          return { key:i, value: v._id, text: v.location }
        })
      }
      return soptions

    default:
      return soptions

    }

  }

  useEffect(() => {
    if(data){
      const stations = data.allStations
      const stationOptions = stations.map((station,index) => {
        return { key:index, value: station.id, text: station.location }
      })
      setOptions(stationOptions)
    }
  },[data])


  const allStationIds =  options.map(station => station.value)

  return (
    <Formik
      initialValues = {{ ...permission }}
      onSubmit= { (values ) => {
        //delete(values.__typename)
        const formValues = { ...values }

        _.reduce(values,(prev,cur,scope) =>
        {
          if(permission[scope] && _.isEqual(permission[scope] , formValues[scope] )){
            delete formValues[scope]

          }
          if(permission[scope] && !_.isEqual( permission[scope] ,formValues[scope] )){
            _.reduce(formValues[scope],(prev,cur,pType) => {
              console.log(scope,pType,formValues[scope][pType],permissions[scope][pType], _.isEqual( permissions[scope][pType],formValues[scope][pType]))
              if( _.isEqual(permissions[scope][pType],formValues[scope][pType] )){
                delete formValues[scope][pType]
              }
            },{})

          }




        },{})

        updatePermission({ variables: { ...formValues,id: permissions.id } })
      }

      }

    >
      {({ setFieldValue,values,handleSubmit,dirty,resetForm }) => <>
        <Header as ='h3'>Permission</Header>
        <Checkbox
          label = 'Administrator (All Permissions for all stations)'
          disabled = { !hasSuperPermission}
          toggle
          name= 'admin'
          checked = {values.admin}
          onChange= {(e,{ checked }) => {
            setFieldValue('admin',checked)
            setSuperUserSet(checked)

            /**If superUser is set then set all permission fileds  */
            if(checked) {
              setFieldValue('station.edit',allStationIds)
              setFieldValue('station.add',true)
              setFieldValue('timesheet.edit',allStationIds)
              setFieldValue('timesheet.view',allStationIds)
              setFieldValue('timesheet.sign',allStationIds)
              setFieldValue('staff.edit',true)
              setFieldValue('staff.add',true)
              setFieldValue('staff.view',true)

            }
          }}/>


        <Form as='table' loading={loading || pLoading} className='ui celled padded table' onSubmit={handleSubmit}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>
          Scope
              </Table.HeaderCell>
              <Table.HeaderCell>
          Edit
              </Table.HeaderCell>
              <Table.HeaderCell>
          Add
              </Table.HeaderCell>
              <Table.HeaderCell>
          View
              </Table.HeaderCell>
              <Table.HeaderCell>
          Sign
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <TableBody>

            {_.map(permissions,(val,key) => <Fragment key={key}>
              {key !== '__typename' && key !== 'id' &&  key !== 'admin' &&
              <FieldArray>
                {() => <Table.Row key={key}>
                  <Table.Cell>
                    {key.toUpperCase()}
                  </Table.Cell>
                  {/**EDIT COLUMN */}
                  <Table.Cell >
                    {(key=== 'station' || key=== 'timesheet') &&
                    <DropDownField
                      multiple
                      selection
                      options= {getStationOptions(`${key}.edit`)}
                      placeholder = 'Add Stations'
                      disabled = {loading || !hasPermission(staff.permission[key].edit) || superUserSet}
                      loading= {loading}
                      name={`${key}.edit`}
                    />}

                    {key === 'staff'?
                      <Checkbox
                        disabled = {  !hasPermission(staff.permission[key].edit) || superUserSet}
                        toggle name={`${key}.edit` }
                        checked = {values[`${key}`].edit }
                        onChange= {(e,{ checked }) => {
                          setFieldValue(`${key}.edit`,checked)

                          /** If edit is enabled then user must have view permission */
                          if(checked) {
                            setFieldValue(`${key}.view`,checked)
                          }

                        }}/> : ''
                    }
                  </Table.Cell >

                  {/**ADD COLUMN */}
                  <Table.Cell >
                    {key !== 'timesheet'?
                      <Checkbox
                        toggle
                        disabled = {  !hasPermission(staff.permission[key].add) || superUserSet}
                        name={`${key}.add`}
                        checked = {values[`${key}`].add }
                        onChange= {(e,{ checked }) => {
                          setFieldValue(`${key}.add`,checked)
                        }}/> : ''
                    }
                  </Table.Cell>

                  {/**VIEW COLUMN */}
                  <Table.Cell  >
                    {key === 'staff' &&
                     <Checkbox
                       disabled = {  !hasPermission(staff.permission[key].view) || superUserSet }
                       toggle
                       name={`${key}.view` }
                       checked = {values[`${key}`].view }
                       onChange= {(e,{ checked }) => {
                       /** If edit is enabled then user must have view permission */
                         if(values.staff.edit){
                           setFieldValue(`${key}.view`,true)
                         }else{
                           setFieldValue(`${key}.view`,checked)
                         }
                       }}/>
                    }

                    {key === 'timesheet' &&
                     <DropDownField
                       multiple
                       selection
                       options={superUserSet?options:getStationOptions(`${key}.view`)}
                       placeholder = 'Add Stations'
                       disabled = {loading  ||  !hasPermission(staff.permission[key].view) || superUserSet}
                       loading= {loading}
                       name={`${key}.view`}
                     />
                    }

                  </Table.Cell>

                  {/**SIGN COLUMN */}
                  <Table.Cell disabled = {key !== 'timesheet'}>
                    {key === 'timesheet' &&
                    <DropDownField
                      multiple
                      selection
                      options={superUserSet?options:getStationOptions(`${key}.sign`)}
                      placeholder = 'Add Stations'
                      disabled = {loading ||  !hasPermission(staff.permission[key].sign) || superUserSet}
                      loading= {loading}
                      name={`${key}.sign`}
                    />
                    }
                  </Table.Cell>
                </Table.Row>}

              </FieldArray>
              }</Fragment>
            )
            }

          </TableBody>
        </Form>
        {dirty &&
        <>
          <Button  onClick = {() => handleSubmit()}> Save Changes</Button>
          <Button  onClick = {() => resetForm()}> Discard Changes</Button>
        </>
        }</>
      }
    </Formik>

  )

}

export default PermissionManager