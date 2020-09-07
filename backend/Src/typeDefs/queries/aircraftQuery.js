const aircraftQuery = `
  extend type Query {
    allAircraft: [Aircraft]
    getAircraft(id:String): Aircraft
  }
`

module.exports = {
  aircraftQuery
}