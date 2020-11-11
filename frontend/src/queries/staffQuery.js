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
      id
      station
      timesheet
      staff
      admin
    }
    }
  }
`

export const GET_ALL_STAFF_MINIMAL = gql`
  query{ allStaff {
    id
    name
  }}
`