const fs = require('fs')
const path = require('path')

const getConnectionStr = () => {
  const data = fs.readFileSync(path.join(__dirname, 'credentials/mongoDB.json'), 'utf8')
  return JSON.parse(data).pwd
}

module.exports = {
  getConnectionStr
}