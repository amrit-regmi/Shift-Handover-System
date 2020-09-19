import { gql } from '@apollo/client'
export const ALL_STATION = gql`
 query {
  allStations {
    location
    shift {
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
      shift {
        name
        startTime
      }
      location
      id
    }
  }

`