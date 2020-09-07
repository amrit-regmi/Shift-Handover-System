

const stationQuery = `
  extend type Query {
    allStations: [Station]
    getStation(location:String,id:String): Station
  }
`

module.exports = {
  stationQuery
}