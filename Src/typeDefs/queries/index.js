const { stationQuery } = require('./stationQuery')
const { costumerQuery }= require('./costumerQuery')
const { aircraftQuery }= require('./aircraftQuery')
const { staffQuery } = require('./staffQuery')

const queries = [stationQuery,costumerQuery,aircraftQuery,staffQuery]
module.exports = { queries }