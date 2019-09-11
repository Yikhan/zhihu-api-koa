const jwt = require('koa-jwt')

const auth = jwt({ secret: process.env.SECRET })

module.exports = {
  auth
}