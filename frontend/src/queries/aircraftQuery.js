import { gql } from '@apollo/client'
export const ALL_AIRCRAFT = gql`
query {
    allAircraft{
      id
      registration
      costumer{
        id
        name
      }

    }
  }
`
export const GET_AIRCRAFT = `
query {
  getAircraft($id: String){
    getAircraft(id: $id){
      id
      registration
      costumer{
        id
        name
      }
    }


  }

}


`