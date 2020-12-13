import { gql } from '@apollo/client'

export const ADD_COSTUMER = gql`
mutation addnewCostumer( $name: String! $stations: [String], $keyContacts: [ContactInput], $contract: String! ,$aircrafts: [String]){
  addCostumer(
    name: $name
    stations: $stations
    keyContacts: $keyContacts
    aircrafts: $aircrafts
    contract: $contract){
      name
      id
      contract
      aircrafts{
        id
        registration
      }
      stations{
        id
      }
    }
}`

export const ADD_AIRCRFAT = gql`
mutation addAircrafttoCostumer( $registration: [String!]! $costumer: String!){
  addAircrafts(
    registration: $registration
    costumer: $costumer
    ){
      id
      registration
    }
}`

export const ADD_CONTACT = gql`
mutation addContactCostumer( $keyContacts: [ContactInput!]! , $costumer: String!){
  addContact(
    keyContacts: $keyContacts
    costumer: $costumer
    ){      
        id
        description
        email
        phone   
    }
}`

export const ADD_STATION_TO_COSTUMER = gql`
mutation addStationCostumer( $stations: [String!]! , $costumer: String){
  addStationsToCostumer(
    stations: $stations
    costumer: $costumer
    ){
      id
      stations{
        id
        location
      }
    }
}`

export const REMOVE_AIRCRFAT = gql`
mutation removeAircraft( $id: String!){
  removeAircraft(
    id: $id
    ){
      status
      message
    }
}`

export const REMOVE_CONTACT = gql`
mutation removeContactCostumer( $id: String! , $costumer: String){
  removeContact(
    id: $id
    costumer: $costumer
    ){
      status
      message
    }
}`

export const REMOVE_COSTUMER_FROM_STATION = gql`
mutation removeStationCostumer( $station: String! , $costumer: String){
  removeCostumerStation(
    station: $station
    costumer: $costumer
    ){
      status
      message
    }
}`

export const DELETE_COSTUMER = gql`
mutation deleteCostumer( $costumer: String){
  deleteCostumer(
    costumer: $costumer
    ){
      status
      message
    }
}`