import { useMutation, useQuery } from '@apollo/client'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Header,Message,Table, TableBody } from 'semantic-ui-react'
import _ from 'lodash'
import { ALL_STATION } from '../../queries/stationQuery'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
import { FieldArray, Formik } from 'formik'
import { CHANGE_PERMISSION } from '../../mutations/permissionMutation'
import { NotificationContext } from '../../contexts/NotificationContext'


const PermissionManager = ({ permissions }) => {
  const [,dispatch] = useContext(NotificationContext)
  const [options,setOptions] = useState([]) // List permitted stations
  const staff =  JSON.parse(sessionStorage.getItem('staffKey'))
  const [superUserSet,setSuperUserSet] = useState((permissions && permissions.admin )|| false) //If the staff is assigned admin permission

  const hasSuperPermission = staff.permission.admin

  // console.log(hasSuperPermission,staff ,superUserSet)
  const [updatePermission,{ loading: pLoading }] = useMutation(CHANGE_PERMISSION,{
    onCompleted: () => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: 'Success, permission changed' ,type: 'SUCCESS' } })
    },

    onError: (err) => {
      dispatch({ type:'ADD_NOTIFICATION',  payload:{ content: <>{'Error, failed to change permission'}<br/> {err.message}</> ,type: 'ERROR' } })
    }
  })

  const mapPermission = (permssionType) => permssionType && permssionType.map(v => {
    if(!v) return null
    return v._id
  })

  /**Generates station option based on user permission
   * User can only assign permsission if the user have rights for the station
   */

  const hasPermission = (permissions) => {
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
        mod.view = mapPermission (mod.view )
        mod.sign = mapPermission (mod.sign)

      }
      return mod

    }
    else return v

  })

  const { loading,data } = useQuery(ALL_STATION,{ skip: !hasSuperPermission })
  useEffect(() => {
    if(data){
      const stations = data.allStations
      const stationOptions = stations.map((station,index) => {
        return { key:index, value: station.id, text: station.location }
      })
      setOptions(stationOptions)
    }
  },[data])



  const getStationOptions = (fieldName) => {
    if (hasSuperPermission) {
      return options
    }
    /**Set return station options based on users current permitted station  */
    let soptions = []
    switch (fieldName){
    case 'station.edit':
      if(staff.permission.station.edit.length ) {
        soptions= staff.permission.station.edit.map((v,i) => {
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

  const allStationIds =  options.map(station => station.value)

  return (
    <Formik
      enableReinitialize
      initialValues = {{ ...permission }}
      onSubmit= { (values ) => {
        const formValues = { ...values }

        if(!formValues.admin) {
          _.reduce(values,(prev,cur,scope) =>
          {
            if(permission[scope] && _.isEqual(permission[scope] , formValues[scope] )){
              delete formValues[scope]

            }
            if(permission[scope] && !_.isEqual( permission[scope] ,formValues[scope] )){
              _.reduce(formValues[scope],(prev,cur,pType) => {
                if( _.isEqual(permissions[scope][pType],formValues[scope][pType] )){
                  delete formValues[scope][pType]
                }
              },{})

            }
          },{})
          updatePermission({ variables: { ...formValues,id: permissions.id } })
        }
        else{

          updatePermission({ variables: { admin:true,id: permissions.id } })
        }


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
              setFieldValue('timesheet.view',allStationIds)
              setFieldValue('timesheet.sign',allStationIds)
              setFieldValue('staff.edit',true)
              setFieldValue('staff.add',true)
              setFieldValue('staff.view',true)

            }
          }}/>

        {
          dirty && <Message warning >Remember to save the changes for changes to take effect </Message>
        }



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
                    {(key=== 'station') &&
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
                  {<Table.Cell >
                    {key!== 'timesheet' &&
                    <Checkbox
                      toggle
                      disabled = {  !hasPermission(staff.permission[key].add) || superUserSet}
                      name={`${key}.add`}
                      checked = {values[`${key}`].add }
                      onChange= {(e,{ checked }) => {
                        console.log(`${key}.add`,checked)
                        setFieldValue(`${key}.add`,checked)
                        if(key === 'staff' && checked){
                          /**If staff has add permission then must have view permission by default */
                          setFieldValue(`${key}.view`,true)
                        }
                      }}/>}

                  </Table.Cell>}

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
                         if(values.staff.edit || values.staff.add ){
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
                       options={getStationOptions(`${key}.view`)}
                       placeholder = 'Add Stations'
                       disabled = {loading  ||  !hasPermission(staff.permission[key].view) || superUserSet}
                       loading= {loading}
                       name={`${key}.view`}
                       onChange = {(e,{ value }) => {
                         /**If user has permission to sign the station timesheet then user must have permission to view the timesheet for that station as well */
                         const newViewValues  = [...new Set([...values.timesheet.sign, ...value])]
                         setFieldValue(`${key}.view`,newViewValues)
                       }}
                     />
                    }

                  </Table.Cell>

                  {/**SIGN COLUMN */}
                  <Table.Cell disabled = {key !== 'timesheet'}>
                    {key === 'timesheet' &&
                    <DropDownField
                      multiple
                      selection
                      name={`${key}.sign`}
                      options={getStationOptions(`${key}.sign`)}
                      placeholder = 'Add Stations'
                      disabled = {loading ||  !hasPermission(staff.permission[key].sign) || superUserSet}
                      onChange = {(e,{ value }) => {
                        setFieldValue(`${key}.sign`,value)
                        /**If user has permission to sign the station timesheet then user must have permission to view the timesheet for that station as well */
                        const newViewValues  = [...new Set([...values.timesheet.view, ...value])]
                        setFieldValue(`${key}.view`,newViewValues)
                      }}
                      loading= {loading}

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
          <Button positive onClick = {() => handleSubmit()}> Save Changes</Button>
          <Button  negative onClick = {() => resetForm()}> Discard Changes</Button>
        </>
        }</>
      }
    </Formik>

  )

}

export default PermissionManager