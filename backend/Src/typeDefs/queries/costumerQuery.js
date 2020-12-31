

const costumerQuery = `
  extend type Query {
    allCostumers: [Costumer]
    getCostumer(name:String,id:String): Costumer
    verifyAircraftRegistration(registrations: String!): [String]
  }
`

module.exports = {
  costumerQuery
}