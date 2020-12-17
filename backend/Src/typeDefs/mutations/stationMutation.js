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

    addToMailingList(
      email: [String!]!
      stationId: String!
    ):ResponseMessage

    removeFromMailingList(
      email: String!
      stationId: String!
    ): ResponseMessage

    addShifts(
      shifts:[ShiftInfoInput!]!
      stationId: String!
    ):[ShiftInfo]

    removeShift(
      id:String!
      stationId: String!
    ): ResponseMessage

    changeStationKey(
      stationKey:String!
      stationId: String!
    ): ResponseMessage

    assignCostumers(
      stationId: String!
      costumers:[String!]!
    ): Station

    deleteStation(
      stationId: String!
    ): ResponseMessage
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