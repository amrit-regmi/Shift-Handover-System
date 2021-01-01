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

    getReportList(
      stations:[String!]!
      filterBy: String!
      year:Int!,
      number:Int!

      ):[ShiftReport]
  }

`
module.exports = { shiftReportQuery }
