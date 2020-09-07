
const timeSheetType = `
  type TimeSheet {
    id: ID!
    staff: Staff!
    startTime: DateTime!
    endTime: DateTime!
    status: Status!
  }  
    

  enum Status {
    APPROVED
    AMENDED
    CLARIFICATION_REQUSTED
    PENDING_APPROVAL
  }


`

module.exports =  timeSheetType
//TODO:
//handover: [HandOver]
//Remarks: [JSON ]