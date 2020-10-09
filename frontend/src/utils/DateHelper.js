import { isNumber } from 'lodash'

/**
 *
 * @param {int javascript date} dateToFormat
 */
export const formatDate = (dateToFormat) => {

  const date = new Date(dateToFormat)

  return (`${(date.getDate()).toString().padStart(2,0)}-${(date.getMonth()+1).toString().padStart(2,0)}-${date.getFullYear()} ${(date.getHours()).toString().padStart(2,0)}:${(date.getMinutes()).toString().padStart(2,0)}`)

}

/**
 *
 * @param {int or date format} date javascript date int or DD-MM-YYYY
 * @param {Double} duration duration to operate
 * @param {String} unit 'd for days, h for hours , m for minutes'
 * @param {String} operation 'add or sub'
 * @returns {string} Date format DD-MM-YYYY HH:MM
 */
export const operateDate = (date, duration, unit , operation) => {
  if(!date){
    return null
  }
  let ndate
  if(!isNumber(date)){
    const splitDateTime = date.split(' ')
    const splitDate = splitDateTime[0].split('-')
    const newDate =`${splitDate[2]}-${splitDate[1]}-${splitDate[0]} ${splitDateTime[1]}`

    ndate = Date.parse(newDate)

  }
  else{
    ndate = new Date(date)
  }

  switch (unit){
  case 'd':
    if(operation === 'add') return  formatDate((ndate + (duration * 24 * 60 * 60 * 1000)))
    if(operation === 'sub') return  formatDate((ndate - (duration * 24 * 60 * 60 * 1000)))
    break
  case 'h':
    if(operation === 'add') return formatDate((ndate + (duration * 60 * 60 * 1000)))
    if(operation === 'sub') return  formatDate((ndate - (duration * 60 * 60 * 1000)))
    break
  case 'm':
    if(operation === 'add') return formatDate((ndate + (duration * 60 * 1000)))
    if(operation === 'sub') return  formatDate(ndate - (duration * 60 * 1000))
    break
  default:
    return formatDate(ndate)
  }
}

/**
 *
 * @param {String} stringDate format DD-MM-YYYY HH:MM
 * @returns {Int} Javascript date int
 */
export const toDate = (stringDate) => {
  let ndate
  if(!isNumber(stringDate)){
    const splitDateTime = stringDate.split(' ')
    const splitDate = splitDateTime[0].split('-')
    const newDate =`${splitDate[2]}-${splitDate[1]}-${splitDate[0]} ${splitDateTime[1] || '00' }:${splitDateTime[2] | '00'}`

    ndate = Date.parse(newDate)
  }
  else{
    ndate = new Date(stringDate)
  }

  return ndate

}
