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
      
      aircrafts @include(if: $detailed) {
        id
        registration
      }
    }
  }
`