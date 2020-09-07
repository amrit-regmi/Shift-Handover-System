const { stationQuery } = require('./stationQuery')
const { costumerQuery }= require('./costumerQuery')
const { aircraftQuery }= require('./aircraftQuery')
const { staffQuery } = require('./staffQuery')
const { shiftReportQuery } = require('./shiftReportQuery')

const queries = [stationQuery,costumerQuery,aircraftQuery,staffQuery,shiftReportQuery]
module.exports = { queries }