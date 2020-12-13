import { gql } from '@apollo/client'
export const GET_STAFF = gql`
query fetchStaff($id:String, $registerCode:String, $withPermission: Boolean!){
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
    lastActive{
      station{
        location
      }
      activeAt
    }
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
export const GET_STAFF_REG = gql`
query fetchStaff($registerCode:String,){
    getStaff(
      registerCode: $registerCode
      ){ 
    name
    }
  }
`

export const GET_ALL_STAFF_MINIMAL = gql`
  query{ allStaff {
    id
    name
    
  }}
`

export const GET_ALL_STAFF = gql`
  query{ allStaff {
    id
    name
    email
    phone
    disabled
    lastActive{
      station{
        location
      }
      activeAt
    }
  }}
`


export const VERIFY_USERNAME = gql`
  query verifyUsername( $username: String!){
    verifyUsername(   
      username: $username,
    ){
      status,
      message
    }
  }`