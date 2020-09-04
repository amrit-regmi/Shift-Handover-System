const { stationMutation } = require('./stationMutation')
const { costumerMutation } = require('./costumerMutation')
const { aircraftMutation } = require('./aircraftMutation')
const { staffMutation } = require('./staffMutation')
const mutations = [stationMutation,costumerMutation,aircraftMutation,staffMutation]
module.exports = { mutations }