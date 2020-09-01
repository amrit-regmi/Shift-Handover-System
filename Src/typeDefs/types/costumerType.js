const { gql } = require('apollo-server')

const costumerType = gql `
  type Costumer {
    id: ID!
    name: String
    stations: [Station]
  }
`

module.exports = { costumerType }

/*    aircrafts: [Aircraft!]!
    staffList: [Staff]*/