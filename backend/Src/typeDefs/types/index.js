const stationType  = require('./stationType')
const costumerType  = require('./costumerType')
const aircraftType  = require('./aircraftType')
const staffType  = require('./staffType')
const enumType  = require('./enumType')
const timeSheetType  = require('./timeSheetType')
const scalarType  = require('./scalerType')
const taskType  = require('./taskType')
const shiftReportType = require('./shiftReportType')

const types = [
  stationType,
  costumerType,
  aircraftType,
  staffType,
  enumType,
  timeSheetType,
  taskType,
  scalarType,
  shiftReportType
]

module.exports = { types }