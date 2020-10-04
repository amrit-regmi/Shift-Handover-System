import { gql } from '@apollo/client'
export const SUBMIT_REPORT = gql`
  mutation submitReport($station: String!, $shift:String! , $startTime: String! ,$endTime: String!, $tasks: [ShiftReportTask]! , $staffs: [ShiftReportStaffs!]! ) { 
  submitShiftReport(
    station:$station
    shift:$shift
    startTime: $startTime
    endTime: $endTime
    tasks:$tasks
    staffs: $staffs
  ){
    endTime
    id
    shift
    staffAndTime {
      id
      staff {
        name
      }
      endTime
      startTime
    }
    startTime
    station {
      location
      id
    }
    tasks {
      aircraft {
        registration
        id
        costumer {
          name
        }
      }
      taskCategory
      description
      id
      status
      
    }
  } 
}
`