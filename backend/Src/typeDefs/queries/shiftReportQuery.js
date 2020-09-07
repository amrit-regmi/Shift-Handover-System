const shiftReportQuery = `
  extend type Query {
    getShiftReport(
      id: String
      station: String
      flag: String
    ):ShiftReport
  }

`
module.exports = { shiftReportQuery }
