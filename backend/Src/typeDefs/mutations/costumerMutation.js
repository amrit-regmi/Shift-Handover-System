
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
      keyContact: ContactInput
    ):Costumer
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