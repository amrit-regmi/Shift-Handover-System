const stationMutation = `
  extend type Mutation {
    addStation(
      location: String,
      costumers: [String]
      shift: [ShiftInfoInput]
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