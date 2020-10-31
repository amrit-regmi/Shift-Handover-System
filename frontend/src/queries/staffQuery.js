import { gql } from '@apollo/client'
export const GET_STAFF = gql`
query fetchStaff($id:String,$registerCode:String, $withPermission: Boolean!){
    getStaff(
      id: $id
      registerCode: $registerCode
      ){ 
    id     
    name
    idCardCode
    currentStation{
      location
    }
    email
    position
    contractType
    lastActive
    username
    resetCode
    phone
    reqHours
    registerCode
    permission  @include(if: $withPermission ) {
      station
      timesheet
      staff
    }
    }
  }
`