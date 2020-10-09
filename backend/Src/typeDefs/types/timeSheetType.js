
const timeSheetType = `
directive @dateTimeconstraint (
  pattern: String
)on FIELD_DEFINITION

  type TimeSheet {
    id: ID!
    staff: Staff!
    startTime: String! @dateTimeconstraint(pattern:"^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)[0-9]{2} (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])$")
    endTime: String! @dateTimeconstraint(pattern:"^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)[0-9]{2} (0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])$")
    status: Status!
    date: Date!
    shiftReport: ShiftReport
  }  
    

  enum Status {
    APPROVED
    AMENDED
    CLARIFICATION_REQUSTED
    PENDING_APPROVAL
  }

  type SignOffToken{
    value: String!
    name: String! 
    startTime:String
    endTime:String
    id:String!
  }


`

module.exports =  timeSheetType
//TODO:
//handover: [HandOver]
//Remarks: [JSON ]