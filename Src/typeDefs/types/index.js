const { stationType } = require('./stationType')
const { costumerType } = require('./costumerType')
const { aircraftType } = require('./aircraftType')
const { staffType } = require('./staffType')

const types = [stationType,costumerType,aircraftType,staffType]
module.exports = { types }