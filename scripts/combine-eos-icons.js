const fs = require('fs-extra')

const combineIconsModels = async params => {
  const { targetDir, destDir } = params

  const data = []

  return fs.readdir(targetDir, (err, files) => {
    if (err) console.log(err)
    return new Promise((resolve, reject) => {
      if (err) reject(err)
      files.forEach(file => {
        const obj = JSON.parse(fs.readFileSync(`${targetDir}${file}`, 'utf8'))
        data.push(obj)
      })
      resolve(data)
    }).then(data => {
      fs.writeFileSync(destDir, JSON.stringify(data, null, 2))
    })
  })
}

module.exports = {
  combineIconsModels
}
