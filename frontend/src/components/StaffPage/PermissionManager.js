import { useQuery } from '@apollo/client'
import React, { Fragment, useEffect, useState } from 'react'
import { Button, Checkbox, Form, Header,Table, TableBody } from 'semantic-ui-react'
import _ from 'lodash'
import { ALL_STATION } from '../../queries/stationQuery'
import { DropDownField } from '../TimeSheetsReport/TimeSheetEditFields'
import { FieldArray, Formik } from 'formik'


const PermissionManager = ({ permissions }) => {

  const permission = _.mapValues(permissions,(v,k) => {
    const mod = { ...v }
    if(k==='station'){
      mod.edit = mod.edit &&  mod.edit.map(v => v._id )
    }

    if(k==='timesheet'){

      mod.edit = mod.edit && mod.edit.map(v => v._id )
      mod.view = mod.view &&  mod.view.map(v => v._id )
      mod.sign = mod.sign &&  mod.sign.map(v => v._id)

    }
    return mod
  })

  const { loading,data } = useQuery(ALL_STATION)
  const [options,setOptions] = useState([])

  useEffect(() => {
    if(data){
      const stations = data.allStations
      const stationOptions = stations.map((station,index) => {
        return { key:index, value: station.id, text: station.location }
      })
      setOptions(stationOptions)
    }
  },[data])

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
        console.log(formValues)
        //console.log(values)
      }



      }

    >
      {({ setFieldValue,values,handleSubmit,dirty }) => <Form onSubmit={handleSubmit}>
        <Header as ='h3'>Permission</Header>
        <Table celled padded>
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
              {key !== '__typename' &&
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
                      options={options}
                      placeholder = 'Add Stations'
                      disabled = {loading}
                      loading= {loading}
                      name={`${key}.edit`}
                    />}
                    {key === 'staff'? <Checkbox toggle name={`${key}.edit` }  checked = {values[`${key}`].edit}  onChange= {(e,{ checked }) => {
                      setFieldValue(`${key}.edit`,checked)
                    }}/> : ''
                    }
                  </Table.Cell >

                  {/**ADD COLUMN */}
                  <Table.Cell >
                    {key !== 'timesheet'?
                      <Checkbox toggle name={`${key}.add`} checked = {values[`${key}`].add} onChange= {(e,{ checked }) => {
                        setFieldValue(`${key}.add`,checked)
                      }}/> : ''
                    }
                  </Table.Cell>

                  {/**VIEW COLUMN */}
                  <Table.Cell  >
                    {key === 'staff' &&
                     <Checkbox toggle  name={`${key}.view`}/>
                    }

                    {key === 'timesheet' &&
                     <DropDownField
                       multiple
                       selection
                       options={options}
                       placeholder = 'Add Stations'
                       disabled = {loading}
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
                      options={options}
                      placeholder = 'Add Stations'
                      disabled = {loading}
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
        </Table>

        {dirty &&
         <Button type= 'submit'> Save Changes</Button>
        }


      </Form>
      }
    </Formik>


  )

}

export default PermissionManager