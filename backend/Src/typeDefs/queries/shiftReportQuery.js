const shiftReportQuery = `
  extend type Query {
    getShiftReport(
      id: String
      station: String
      flag: String
    ):ShiftReport

    getShiftReportByShift(
      station: String!
      shift: String!, 
      date: Date!
    ):ShiftReport

    getReportList(stationId:String):[ShiftReport]
  }

`
module.exports = { shiftReportQuery }
