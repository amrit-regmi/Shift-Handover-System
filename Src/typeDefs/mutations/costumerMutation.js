const { gql } = require('apollo-server')

const costumerMutation = gql`
  type Mutation {
    addCostumer(
      name: String
      stations: [String]
    ):Station
  }
`

module.exports = {
  costumerMutation
}