const { gql } = require('apollo-server')

const stationMutation = gql`
  type Mutation {
    addStation(
      location: String,
      costumers: String
      shiftInfo: [ShiftInfoInput]
    ):Station
  }

  input ShiftInfoInput{
    name: String
    startTime: String
  }
`

module.exports = {
  stationMutation
}