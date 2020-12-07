import { gql } from '@apollo/client'
export const ALL_STATION = gql`
 query ($detailed: Boolean = false ){
  allStations {
    id
    location
    shifts @skip(if: $detailed){
      name
      startTime
    }
    address @include(if: $detailed){
      country
      postcode
      city
      street
    }
    phone @include(if: $detailed)
    email @include(if: $detailed)
    activeStaffs @include(if: $detailed)
    
  }
}`

export const GET_STATION = gql`
  query fetchStation($id: String!){
    getStation(id: $id) {
      costumers {
        contract
        aircrafts {
          registration
        }
        name
        id
      }
      shifts {
        name
        startTime
      }
      location
      id
      address {
        country
        postcode
        city
        street
      }
      phone
      email
      staffList{
        id
        name
        lastActive{
          activeAt
        }
      }
      procedures{
        title
        description
      }
    }
  }

`