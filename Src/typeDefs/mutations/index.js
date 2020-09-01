const { stationMutation } = require('./stationMutation')
const { costumerMutation } = require('./costumerMutation')
const mutations = [stationMutation,costumerMutation]
module.exports = { mutations }