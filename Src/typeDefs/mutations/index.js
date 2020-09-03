const { stationMutation } = require('./stationMutation')
const { costumerMutation } = require('./costumerMutation')
const { aircraftMutation } = require('./aircraftMutation')
const mutations = [stationMutation,costumerMutation,aircraftMutation]
module.exports = { mutations }