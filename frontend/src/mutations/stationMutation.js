import { gql } from '@apollo/client'
export const LOGIN_TO_STATION = gql`
  mutation stationLogin($id: String!, $password:String!){
    loginToStation(id: $id, password: $password) 
  }

`