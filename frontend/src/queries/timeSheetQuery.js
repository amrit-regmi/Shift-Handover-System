import { gql } from '@apollo/client'
export const GET_TIMESHEETS =
gql `query getTimesheetByUser($staff: String!, $filterDuration: String! ,$number: Int!, $year: Int!){
  getTimeSheetByUser(
    staff: $staff,
     filterDuration: $filterDuration, 
     number: $number, 
     year: $year
    ) {
      id
      startTime
      status
      date
      endTime
      break
      remarks{
        by
        date
        edit
        text
        title
      }
      staff{
        id
        name
        reqHours
        contractType
      }
      shiftReport {
        shift
        id
        station {
          id
          location
        }
      }

      shift
      station{
        id
        location
      }

  },

  getStaffName(
    id: $staff
    )

}`

export const GET_ALL_TIMESHEETS = gql`
query getAllTimeSheets(
  $staffId: String, $staff: [String] ,$period: String, $from: String , $to: String, $number: Int, $groupBy: String , $year: Int, $stations: [String], $filterStatus: String
){
  getAllTimeSheets(
    staff:$staff,
    period:$period,
    from: $from,
    to:$to ,
    number:$number ,
    groupBy:$groupBy,
    year:$year ,
    stations:$stations
    filterStatus: $filterStatus
    )
  getStaffName(
      id: $staffId
      )
   
}`