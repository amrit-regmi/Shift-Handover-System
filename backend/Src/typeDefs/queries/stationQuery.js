

const stationQuery = `
  extend type Query {
    allStations(detailed:Boolean): [Station]
    getStation(id:String!): Station
  }
`

module.exports = {
  stationQuery
}