require('dotenv').config()

// eslint-disable-next-line no-undef
const MONGODB_URI = process.env.MONGODB_URI
const JWT_SECRET = process.env.JWT_SECRET
const PORT = process.env.PORT

module.exports = { MONGODB_URI, JWT_SECRET, PORT }