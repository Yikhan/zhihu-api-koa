
getQueryFileds = (fields) => {
  return fields.split(';')
  .filter(f => f) // need to filter out empty string
  .map(f => ' +' + f).join('')
}

module.exports = {
  getQueryFileds
}