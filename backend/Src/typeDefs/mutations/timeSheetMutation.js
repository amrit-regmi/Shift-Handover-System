const timeSheetMutation = `
  extend type Mutation {
    addToTimeSheet(
      startTime: DateTime!
      endTime: DateTime!
      handover:String!
      staff: String!
    )
    : TimeSheet

    signOffTimeSheet(
      startTime: String!
      endTime: String!
      username: String
      password: String
      idCardCode: String
    ): SignOffToken
  }



`
module.exports =  { timeSheetMutation }
/*TODO:
  UpdateTimesheet with remarks
  Add cleraification/comments
  ApproveOne
  ApproveAll
  */
