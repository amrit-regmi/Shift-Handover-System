import { gql } from '@apollo/client'

export const GET_SHIFT_REPORT = gql `
query fetchReport($id:String, $station: String, $flag: String){
    getShiftReport(id: $id, station: $station, flag: $flag) {
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
        id
        aircraft {
          registration
          id
          costumer {
            name
          }
        }
        taskCategory
        description
        status
        updates {
          action
          handoverId 
          handoverDetail
          note
        }
        
      }
    } 
}

`

export const GET_REPORTLIST = gql ` 
  query fetchReportList ( $stations: [String!]!, $filterBy: String!, $year:Int! , $number:Int!  ){
    getReportList (stations: $stations, filterBy: $filterBy, year: $year , number:$number){
      startTime,
      endTime,
      id,
      shift
      station{
        location
      }
    }
  }


`

export const GET_SHIFTREPORT_ID = gql `
  query fetchReportbyShift($station: String!, $shift: String!, $date: Date!){
    getShiftReportByShift(station: $station, shift: $shift, date: $date) {
      startTime,
      endTime,
      id,
      shift,
      station{
        location
      }
    }
  }
`
/** */