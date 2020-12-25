require('dotenv').config()

// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT
const MAIL_CONFIG = JSON.parse(process.env.MAIL_CONFIG)
const FQDN = process.env.FQDN

module.exports = { MONGODB_URI, JWT_SECRET, FQDN, PORT, MAIL_CONFIG }