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
        updates {
          action
          handoverId {
            id
            shift
          }
          note
        }
        
      }
    } 
}

`

export const GET_REPORTLIST = gql ` 
  query fetchReportList ( $stationId: String,  ){
    getReportList (stationId: $stationId){
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
/** */