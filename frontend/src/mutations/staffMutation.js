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