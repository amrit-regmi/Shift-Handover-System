const shiftReportMutation = `
  extend type Mutation {
    submitShiftReport(
      station:String!
      shift:String
      startTime: String!
      endTime: String!
      tasks:[ShiftReportTask]!
      staffs: [ ShiftReportStaffs!]!
    ):ShiftReport

    startReporting(
      station:String!
      startTime: String!
      shift: String!
    ): ShiftReport
  }
  
  
  input ShiftReportTask{
    taskId: String
    taskCategory: TaskCategory!
    aircraft : String
    description: String!
    status: TaskStatus
    createdBy: String
    update: [JsonObject]
  }

  input ShiftReportStaffs{
    staff: String
    startTime: String!
    endTime: String!
  }
`
module.exports = { shiftReportMutation }