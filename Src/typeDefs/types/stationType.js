const { gql } = require('apollo-server')
const stationType = gql `
  type Station {
    id: ID!
    location: String!
   
    costumers: [Costumer]
    shift: [ShiftInfo]
  }

  type ShiftInfo {
    name: String
    startTime: String
  }
`

module.exports = { stationType }
/* staffList: [Staff]*/