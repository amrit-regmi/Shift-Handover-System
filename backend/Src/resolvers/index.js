const { stationResolver } = require('./stationResolver')
const { costumerResolver } = require('./costumerResolver')
const { aircraftResolver } = require('./aircraftResolver')
const { staffResolver } = require('./staffResolver')
const { timeSheetResolver } = require('./timeSheetResolver')
const { scalerResolver } = require('./scalerResolver')
const shiftReportResolver = require('./shiftReportResolver')

const resolvers = [stationResolver, costumerResolver, aircraftResolver,staffResolver,timeSheetResolver,scalerResolver,shiftReportResolver]

module.exports = { resolvers }