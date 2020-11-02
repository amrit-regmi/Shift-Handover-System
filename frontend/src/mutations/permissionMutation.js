import { gql } from '@apollo/client'

export const CHANGE_PERMISSION = gql`
mutation changePermission( $id: String! $staff: JsonObject, $station: JsonObject, $timesheet: JsonObject ,$admin: Boolean){
  changePermission(
    id: $id
    staff: $staff
    station: $station
    timesheet: $timesheet
    admin: $admin
    ){
      id
      staff
      station
      timesheet
      admin
    }
}`