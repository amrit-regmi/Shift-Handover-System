const { stationQuery } = require('./stationQuery')
const { costumerQuery }= require('./costumerQuery')
const { aircraftQuery }= require('./aircraftQuery')

const queries = [stationQuery,costumerQuery,aircraftQuery]
module.exports = { queries }