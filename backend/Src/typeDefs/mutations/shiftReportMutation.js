const shiftReportMutation = `
  extend type Mutation {
    submitShiftReport(
      station:String!
      shift:String
      startTime: String!
      endTime: String!
      tasks:[ShiftReportTask]!
      staffs: [ShiftReportStaffs!]!
    ):ShiftReport

    startReporting(
      station:String!
      startTime: String!
      shift: String!
    ): ShiftReport
  }
  
  
  input ShiftReportTask{
    id: String
    taskCategory: TaskCategory
    aircraft : String
    description: String
    status: String
    action: String
    createdBy: String
    newNote:String
  }

  input ShiftReportStaffs{
    name: String
    signOffKey: String!
  }
`
module.exports = { shiftReportMutation }