const { stationType } = require('./stationType')
const { costumerType } = require('./costumerType')
const { aircraftType } = require('./aircraftType')
const { staffType } = require('./staffType')
const { enumType } = require('./enumType')

const types = [stationType,costumerType,aircraftType,staffType,enumType]
module.exports = { types }