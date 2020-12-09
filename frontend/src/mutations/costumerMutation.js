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
    }
}`