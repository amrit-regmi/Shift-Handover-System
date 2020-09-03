const { stationResolver } = require('./stationResolver')
const { costumerResolver } = require('./costumerResolver')
const { aircraftResolver } = require('./aircraftResolver')
const resolvers = [stationResolver, costumerResolver, aircraftResolver]
module.exports = { resolvers }