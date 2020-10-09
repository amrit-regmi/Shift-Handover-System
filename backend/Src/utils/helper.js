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
* @param {Int} w between 1-52/53
* @param {Int} y year
* @return {Date}
*/
const getDateFromMonth = (m,y) => {
  let d = new Date(y,m,0)
  return d
}

/**
 * @param {double} ms sleep duraion in ms
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}


module.exports = { isExpired,generateShiftReportId,sleep, getDateFromMonth, getDatefromWeek  }