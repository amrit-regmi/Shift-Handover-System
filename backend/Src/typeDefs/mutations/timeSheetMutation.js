const timeSheetMutation = `
  extend type Mutation {
    addToTimeSheet(
      startTime: DateTime!
      endTime: DateTime!
      handover:String!
      staff: String!
    )
    : TimeSheet
  }

`
module.exports =  { timeSheetMutation }
/*TODO:
  UpdateTimesheet with remarks
  Add cleraification/comments
  ApproveOne
  ApproveAll
  */
