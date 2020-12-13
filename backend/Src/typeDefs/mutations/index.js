const { stationMutation } = require('./stationMutation')
const { costumerMutation } = require('./costumerMutation')
const { staffMutation } = require('./staffMutation')
const { timeSheetMutation } = require('./timeSheetMutation')
const { shiftReportMutation } = require('./shiftReportMutation')
const { permissionMutation } = require('./permissionMutation')
const mutations = [stationMutation,costumerMutation,staffMutation,timeSheetMutation,shiftReportMutation,permissionMutation]
module.exports = { mutations }