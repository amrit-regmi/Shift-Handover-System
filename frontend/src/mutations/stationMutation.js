import { gql } from '@apollo/client'
export const LOGIN_TO_STATION = gql`
  mutation stationLogin($id: String!, $password:String!){
    loginToStation(id: $id, password: $password) 
  }
`

export const ADD_STATION = gql`
  mutation addStation ($location:String! , $address: AddressInput! , $phone: String! ,$email: String!, $shifts: [ShiftInfoInput!]!, $costumers: [String], $stationKey:String! ){
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
  }`

export const ADD_TO_MAILINGLIST = gql` mutation addToMailingList($emails:[String!]! , $stationId: String!){
    addToMailingList(
      email: $emails
      stationId: $stationId
    ){
      status
      message
    }
  }

  `

export const REMOVE_FROM_MAILINGLIST = gql`mutation removeFromMailingList($email:String! , $stationId: String!){
    removeFromMailingList(
      email: $email
      stationId: $stationId
    ){
      status
      message
    }
  }`
export const ADD_SHIFTS= gql`mutation addShifts($shifts:[ShiftInfoInput!]!, $stationId: String!){
    addShifts(
      shifts:$shifts
      stationId: $stationId
    ) {
      id
      name
      startTime
    }
  }`

export const REMOVE_SHIFTS = gql` mutation removeShift( $id:String! ,$stationId: String!){
    removeShift(
      id:$id
      stationId: $stationId
    ){
      status
      message
    }
  }
  `

export const CHANGE_STATION_KEY = gql`mutation changeStationKey(
    $stationKey:String!
    $stationId: String!
  ){
    changeStationKey(
      stationKey: $stationKey
      stationId: $stationId
    ){
     status
      message
    }
  }

  `

export const DELETE_STATION = gql`mutation deleteStation ( $stationId: String!){
    deleteStation( stationId: $stationId){
      status
      message
    }

  }

  `

export const ASSIGN_COSTUMERS = gql`mutation  assignCostumers( $stationId: String! $costumers:[String!]!){
    assignCostumers(
      stationId: $stationId,
      costumers: $costumers
    ){
      id
      costumers {
        id
        name
        contract
        aircrafts{
        id
      }
    }
    }
  }

 
`