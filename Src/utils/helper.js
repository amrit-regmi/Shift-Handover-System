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

module.exports = { isExpired }