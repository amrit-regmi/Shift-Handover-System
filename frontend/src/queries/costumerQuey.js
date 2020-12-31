import { gql } from '@apollo/client'
export const ALL_COSTUMERS = gql`
query fetchAllCostumers ($detailed: Boolean = false) {
    allCostumers {
      name
      id
      stations  @include(if: $detailed) {
        id
        location
      }
      contract @include(if: $detailed)
      aircrafts @include(if: $detailed) {
        id
        registration
      }
    }
  }
`

export const VERIFY_REGISTRATION = gql`
query verifyReg ($registrations:String!){
  verifyAircraftRegistration(registrations: $registrations)
}
`

export const GET_COSTUMER = gql ` 
query getCostumerId ($id:String){
  getCostumer(
    id:$id
  ){
    name
    id 
    stations{
      id
      location
      address{
        street
        postcode
        city
        country
      }
    }
    aircrafts{
      id
      registration
    }
    contract
    keyContacts{
      id
      phone
      description
      email
    }


  }
}

`