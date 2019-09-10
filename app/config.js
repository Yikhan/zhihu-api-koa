const fs = require('fs')

const getConnectionStr = () => {
  const data = fs.readFileSync(__dirname + '/credentials/mongoDB.json', 'utf8')
  return JSON.parse(data).pwd
}

module.exports = {
  getConnectionStr
}