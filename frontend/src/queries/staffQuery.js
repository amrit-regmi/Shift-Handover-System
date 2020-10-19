import { gql } from '@apollo/client'
export const GET_STAFF = gql`
query fetchStaff($id:String,$registerCode:String){
    getStaff(
      id: $id
      registerCode: $registerCode
      ){      
    name
    idCardCode
    currentStation{
      location
    }
    email
    position
    contractType
    lastActive
    username
    resetCode
    reqHours
    }
  }
`