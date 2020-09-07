const { stationMutation } = require('./stationMutation')
const { costumerMutation } = require('./costumerMutation')
const { aircraftMutation } = require('./aircraftMutation')
const { staffMutation } = require('./staffMutation')
const { timeSheetMutation } = require('./timeSheetMutation')
const { shiftReportMutation } = require('./shiftReportMutation')
const mutations = [stationMutation,costumerMutation,aircraftMutation,staffMutation,timeSheetMutation,shiftReportMutation]
module.exports = { mutations }