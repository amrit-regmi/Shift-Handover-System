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
  }
`