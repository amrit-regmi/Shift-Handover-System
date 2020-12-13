
const costumerMutation = `
   extend type Mutation {
    addCostumer(
      name: String!
      stations: [String]
      keyContacts:[ContactInput]
      contract: String!
      aircrafts:[String]
    ):Costumer

    addContact(
      costumer: String!
      keyContacts: [ContactInput!]!
    ):[Contact]

    addStationsToCostumer( stations: [String!]! , costumer: String):Costumer

    addAircrafts(
      registration:[String!]!
      costumer: String!
    ):[Aircraft]
   
    removeAircraft( id: String!):ResponseMessage
    removeContact( id: String! , costumer: String): ResponseMessage
    removeCostumerStation( station: String! , costumer: String): ResponseMessage
    deleteCostumer( costumer: String): ResponseMessage
  }

  input ContactInput {
    phone: String
    description: String!
    email: String
  }
`

module.exports = {
  costumerMutation
}