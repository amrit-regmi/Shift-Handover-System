const timeSheetMutation = `
directive @dateTimeconstraintin (
  pattern: String
)on ARGUMENT_DEFINITION
  extend type Mutation {
    addToTimeSheet(
      id: String
      startTime: String @dateTimeconstraintin (pattern:"^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)[0-9]{2} (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])$")
      endTime: String   @dateTimeconstraintin (pattern:"^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)[0-9]{2} (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])$")
      break:Int
      handover:String
      shift: String
      station: String
      staff: String
      remarks: [RemarkInput]
    )
    : TimeSheet

    signOffTimeSheet(
      startTime: String! @dateTimeconstraintin (pattern:"^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)[0-9]{2} (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])$")
      endTime: String!   @dateTimeconstraintin (pattern:"^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)[0-9]{2} (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])$")
      break:Int
      username: String
      password: String
      idCardCode: String
      additionalAction: String
      email: String
      name: String
      id:String
      
    ): SignOffToken
  }

  input RemarkInput{
    title: String!
    date: String!
    text: String
    edit: JsonObject
    by: String!
  }



`
module.exports =  { timeSheetMutation }
/*TODO:
  UpdateTimesheet with remarks
  Add cleraification/comments
  ApproveOne
  ApproveAll
  */
