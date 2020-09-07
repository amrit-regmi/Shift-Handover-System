const costumerType =  `
  type Costumer {
    id: ID!
    name: String
    stations: [Station]
    aircrafts: [Aircraft!]!
    staffList: [Staff]
  }
`

module.exports =  costumerType

