
getQueryFileds = (fields) => {
  return fields ? 
    fields.split(';')
    .filter(f => f) // need to filter out empty string
    .map(f => ' +' + f).join('') : ''
}

getQueryPopulates = (fields) => {
  return fields ? 
    fields.split(';')
    .filter(f => f) // need to filter out empty string
    .map(f => {
      switch (f) {
        case 'careers':
          return 'careers.company careers.occupation'
        case 'educations':
          return 'educations.school educations.major'
        default:
          return f
      }
    }).join(' ') : ''
}

module.exports = {
  getQueryFileds,
  getQueryPopulates
}