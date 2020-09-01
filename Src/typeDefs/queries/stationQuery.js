const { gql } = require('apollo-server')

const stationQuery = gql`
  type stationQuery {
    allStations: [Station]
  }
`

module.exports = {
  stationQuery
}