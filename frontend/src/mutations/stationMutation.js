import { gql } from '@apollo/client'
export const LOGIN_TO_STATION = gql`
  mutation stationLogin($id: String!, $password:String!){
    loginToStation(id: $id, password: $password) 
  }
`

export const ADD_STATION = gql`
  mutation addStation ($location:String! , $address: AddressInput! , $phone: String! ,$email: String!, $shifts: [ShiftInfoInput], $costumers: [String], $stationKey:String! ){
    addStation(
      location:$location
      address:$address
      phone:$phone
      email:$email
      shifts:$shifts
      costumers:$costumers
      stationKey: $stationKey
    ){
      id
    }
  }
`