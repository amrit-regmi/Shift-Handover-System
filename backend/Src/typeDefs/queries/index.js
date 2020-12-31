const { stationQuery } = require('./stationQuery')
const { costumerQuery }= require('./costumerQuery')
const { aircraftQuery }= require('./aircraftQuery')
const { staffQuery } = require('./staffQuery')
const { shiftReportQuery } = require('./shiftReportQuery')
const { timeSheetQuery } = require('./timeSheetQuery')

const queries = [stationQuery,costumerQuery,aircraftQuery,staffQuery,shiftReportQuery,timeSheetQuery]
module.exports = { queries }