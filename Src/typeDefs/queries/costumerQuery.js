const { gql } = require('apollo-server')

const costumerQuery = gql`
  type Query {
    allCostumers: [Costumer]
  }
`

module.exports = {
  costumerQuery
}