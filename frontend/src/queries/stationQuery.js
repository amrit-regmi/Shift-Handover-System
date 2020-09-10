import {gql} from '@apollo/client'
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
}
`