const stationMutation = `
  extend type Mutation {
    addStation(
      location: String!
      address: AddressInput!
      costumers: [String]
      shifts: [ShiftInfoInput]
      email: String!
      phone: String!
      stationKey: String!
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

  input AddressInput{
    country: String
    postcode: String
    city: String
    street: String
  }

  
`

module.exports = {
  stationMutation
}