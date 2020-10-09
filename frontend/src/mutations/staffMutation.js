import { gql } from '@apollo/client'
export const LOGIN_STAFF = gql`
  mutation staffLogin($username: String!, $password:String!){
    staffLogin(username: $username, password: $password) 
  }

`