import { gql } from '@apollo/client'
export const GET_TIMESHEETS =
gql `query fetchTimesheet($staff: String!, filterDuration: String! ,number: Int!, year: Int!){
  getTimeSheetByUser(
    staff: $staff,
     filterDuration: $filterDuration, 
     number: $number, 
     year: $year) {
    id
    startTime
    endTime
    status
    date
    
  }

}`
