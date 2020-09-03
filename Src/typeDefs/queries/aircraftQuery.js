const aircraftQuery = `
  extend type Query {
    allAircraft: [Aircraft]
    getAircraft(registration:String,id:String): Aircraft
  }
`

module.exports = {
  aircraftQuery
}