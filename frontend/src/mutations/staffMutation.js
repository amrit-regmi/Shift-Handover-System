import { gql } from '@apollo/client'
export const LOGIN_STAFF = gql`
  mutation staffLogin($username: String!, $password:String!){
    staffLogin(username: $username, password: $password) 
  }
`

export const RESET_PASSWORD = gql`
mutation resetPassword ($resetCode: String!, $password: String!){
  resetPassword(
    password: $password,
    resetCode: $resetCode
  ){
    status
    message
  }
}`

export const RESET_REGISTER_CODE = gql`
mutation resetRegisterCode ($id: String!){
  resetRegisterCode(
    id: $id,
  ){
    status
    message
  }
}`

export const RESET_PASSWORD_REQ = gql`
mutation resetPasswordReq ($id: String!){
  resetPasswordReq(
    id: $id,
  ){
    status
    message
  }
}`

export const CHANGE_PASSWORD = gql`
mutation changePassword ( $id: String!, $password: String!, $newPassword: String! ){
  changePassword ( 
    id: $id,
    password: $password,
    newPassword: $newPassword
    ){
      status
      message
    }
}`

export const STAFF_EDIT = gql`
mutation staffEdit($id:String! $email:String, $phone: String , $contractType: String , $reqHours: Float , $position :String){
  staffEdit(
    id: $id,
    email:$email,
    phone:$phone,
    contractType: $contractType,
    reqHours: $reqHours,
    position: $position
  ){
    id
    email
    phone
    contractType
    reqHours
    position
  }
}`

export const STAFF_ADD = gql`
  mutation addStaff( $name: String!, $email: String!, $contractType: String! , $ contractHours: Int!, $position: String, $idCardCode: String){
    addStaff(
      name: $name,
      email:$email,
      contractType: $contractType,
      contractHours: $contractHours,
      position: $position
      idCardCode: $idCardCode
    ){
      id,
      name,
      email,
      phone
    }
  }
`

export const SET_STAFF_STATUS= gql`
  mutation toggleleStaffStatus( $id: String!, $disabled: Boolean! ){
    setStaffStatus(
      id: $id,
      disabled: $disabled
      )
      {
      status
      message
    }
  }
`

export const DELETE_STAFF= gql`
  mutation deleteStaff( $id: String!){
    staffDelete(
      id: $id,
    ){
      status
      message
    }
  }
`

export const COMPLETE_REGISTRATION = gql`
  mutation registerStaff( $registerCode:String!, $username: String!, $password: String!){
    registerStaff(
      registerCode: $registerCode
      username: $username,
      password:$password,
    ){
      status,
      message
    }
  }`
