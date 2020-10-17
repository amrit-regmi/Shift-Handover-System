const stationType = `
  type Station {
    id: ID!
    location: String!
    costumers: [Costumer]
    shifts: [ShiftInfo]
  }

  type ShiftInfo {
    name: String
    startTime: String
  }
`

module.exports =  stationType
/* staffList: [Staff]*/