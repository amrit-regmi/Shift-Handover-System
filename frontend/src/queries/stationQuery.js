import { gql } from '@apollo/client'
export const ALL_STATION = gql`
 query {
  allStations {
    location
    shifts {
      name
      startTime
    }
    id
  }
}`

export const GET_STATION = gql`
  query fetchStation($id: String!){
    getStation(id: $id) {
      costumers {
        aircrafts {
          id
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
    }
  }

`

export const ALL_STATION_LIST = gql`
 query {
  allStations {
    id
    location{
      airportCode
    }
    phone
    email
    address
  }
}`