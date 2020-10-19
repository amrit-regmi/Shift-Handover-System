import { gql } from '@apollo/client'
export const SIGN_OFF_SHIFT = gql`
  mutation signOff($startTime: String!, $break:Int, $endTime:String!, $username: String, $password:String, $idCardCode: String, $additionalAction: String, $id:String, $email: String, $name: String ){
    signOffTimeSheet(
      startTime: $startTime, 
      endTime:$endTime, 
      break: $break,
      username: $username, 
      password: $password , 
      additionalAction: $additionalAction,
      email: $email,
      name: $name,
      idCardCode: $idCardCode
      id: $id
      ) {
        name,
        value,
        break,
        startTime,
        endTime,
        id
      }
  }`
export const UPDATE_TIMESHEET = gql`
 mutation updateTimeSheet($id: String, $startTime: String , $endTime: String, $station: String, $shift : String, $break: Int, $staff: String, $remarks: [RemarkInput], $handover: String){
  addToTimeSheet(
      id: $id
      startTime: $startTime , 
      endTime: $endTime,
      station: $station, 
      shift: $shift,  
      staff: $staff
      break: $break,
      remarks:$remarks,
      handover:$handover,
  )
    {
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
        reqHours
      }
      shiftReport {
        shift
        id
        station {
          location
        }
      }

      shift
      station

  } 
  

 }
`