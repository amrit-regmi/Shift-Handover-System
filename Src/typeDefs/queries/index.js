const { stationQuery } = require('./stationQuery')
const { costumerQuery }= require('./costumerQuery')

const queries = [stationQuery,costumerQuery]
module.exports = { queries }