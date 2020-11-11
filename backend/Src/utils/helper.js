const { isNumber } = require('lodash')
/**
 * Returns the expiry status of uuid codes.
 *
 * @param {string} uuid uuid to verify.
 * @param {number} hours uuid expiry hours.
 * @return {boolean} returns true if expired.
 */
const isExpired = (uuid, hours ) => {
  const splitUuid = uuid.split('-')
  const timeStampHexCode = [
    splitUuid[ 2 ].substring( 1 ),
    splitUuid[ 1 ],
    splitUuid[ 0 ]
  ].join( '' )
  const timeStampInt = parseInt(timeStampHexCode,16)
  const jsDate = new Date((timeStampInt - 122192928000000000 )/10000)
  const differenceInHours = (Date.now() - jsDate)/(1000 * 60 * 60)

  if( differenceInHours > hours ){
    return true
  }
  return false

}

/**
 * Returns the unique shiftReportId
 * @param {String} location location value of shiftReport station
 * @param {ISODateTime} date shiftReportdate
 * @param {String} shift shiftName
 * @returns {String} shiftReportId
 * THIS IS NOT YET IMPLEMENTED ANYWHERE
 */

const generateShiftReportId = (location,date,shift) => {
  const id = `${location}${date.substring(0,10)}${shift}`
  return id
}

/**
* Returns the week start date(Monday) for given year and weeknumber
* @param {Int} w between 1-52/53
* @param {Int} y year
* @returns {Date}
*/
const getDatefromWeek = (w,y) => {
  const simpleStartDate = new Date(Date.UTC(y,0,1 + (w-1) *7))
  const dayOfWeek = simpleStartDate.getDay()

  let IsoWeekStart = simpleStartDate
  if(dayOfWeek <=4) {
    IsoWeekStart.setDate(simpleStartDate.getDate() - simpleStartDate.getDay()+1)
  }else {
    IsoWeekStart.setDate(simpleStartDate.getDate()+8 - simpleStartDate.getDay())
  }
  return IsoWeekStart
}

/**
* Returns the last day of the month for given year
* @param {Int} m month
* @param {Int} y year
* @return {Date}
*/
const getLastDateFromMonth = (m,y) => {
  let d = new Date(y,m+1,0)
  return d
}

const getMonthName = (m) => {
  const month = ['January','February','March','April','May','June','July','August','September','October','November','December']
  return month[m]

}

/**
 * @param {double} ms sleep duraion in ms
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 *
 * @param {String} stringDate format DD-MM-YYYY HH:MM
 * @returns {Int} Javascript date int
 */

const toDate = (stringDate) => {
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

const getWeek= (dt) => {
  var tdt = new Date(dt.valueOf())
  var dayn = (dt.getDay() + 6) % 7
  tdt.setDate(tdt.getDate() - dayn + 3)
  var firstThursday = tdt.valueOf()
  tdt.setMonth(0, 1)
  if (tdt.getDay() !== 4)
  {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7)
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000)
}

/**
 *
 * @param {int javascript date} dateToFormat
 */
const formatDate = (dateToFormat) => {

  const date = new Date(dateToFormat)

  return (`${(date.getDate()).toString().padStart(2,0)}-${(date.getMonth()+1).toString().padStart(2,0)}-${date.getFullYear()} ${(date.getHours()).toString().padStart(2,0)}:${(date.getMinutes()).toString().padStart(2,0)}`)

}

module.exports = { isExpired,generateShiftReportId,sleep, getLastDateFromMonth, getDatefromWeek ,getMonthName ,toDate ,getWeek,formatDate }