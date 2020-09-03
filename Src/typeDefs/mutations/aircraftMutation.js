
const aircraftMutation = `
extend type Mutation {
 addAircraft(
   registration: String
   costumer: String
 ):Aircraft
}
`

module.exports = {
  aircraftMutation
}