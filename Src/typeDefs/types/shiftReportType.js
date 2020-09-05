const shiftReportType = `
  type ShiftReport {
    id: ID!
    station: Station!
    shift: String!
    startTime: DateTime!
    endTime: DateTime
    tasks:[Task]
    staffAndTime: [TimeSheet]
  }
`
module.exports = shiftReportType