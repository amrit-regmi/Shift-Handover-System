import { gql } from '@apollo/client'
export const GET_TIMESHEETS =
gql `query fetchTimesheet($staff: String!, $filterDuration: String! ,$number: Int!, $year: Int!){
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

  getStaff(
    id: $staff
    ){    
  name}

}`
