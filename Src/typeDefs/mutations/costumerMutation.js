
const costumerMutation = `
   extend type Mutation {
    addCostumer(
      name: String
      stations: [String]
    ):Costumer
  }
`

module.exports = {
  costumerMutation
}