const { stationResolver } = require('./stationResolver')
const { costumerResolver } = require('./costumerResolver')
const { aircraftResolver } = require('./aircraftResolver')
const { staffResolver } = require('./staffResolver')
const resolvers = [stationResolver, costumerResolver, aircraftResolver,staffResolver]
module.exports = { resolvers }