const { stationResolver } = require('./stationResolver')
const { costumerResolver } = require('./costumerResolver')
const resolvers = [stationResolver, costumerResolver]
module.exports = { resolvers }