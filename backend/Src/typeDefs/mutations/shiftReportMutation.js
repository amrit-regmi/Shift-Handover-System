const shiftReportMutation = `
  extend type Mutation {
    submitShiftReport(
      station:String!
      shift:String
      startTime: String!
      endTime: String!
      tasks:[ShiftReportTask]!
      staffs: [String!]!
    ):ShiftReport

    startReporting(
      station:String!
      startTime: String!
      shift: String!
    ): ShiftReport
  }
  
  
  input ShiftReportTask{
    taskId: String
    taskCategory: TaskCategory
    aircraft : String
    description: String
    status: TaskStatus
    action: String
    createdBy: String
    update: Update
  }

  input ShiftReportStaffs{
    name: String!
    signOffKey: String!
  }

  input Update {
    handoverId: String!
    action: TaskStatus!
    updateBy: String
    notes: String
  }
`
module.exports = { shiftReportMutation }