const stationMutation = `
  extend type Mutation {
    addStation(
      location: String
      costumers: [String]
      shift: [ShiftInfoInput]
    ):Station

    loginToStation(
      id: String!
      password: String!
    ):JsonObject
  }

  input ShiftInfoInput{
    name: String
    startTime: String
  }

  
`

module.exports = {
  stationMutation
}