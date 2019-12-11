const fs = require('fs-extra')

const combineIconsModels = async params => {
  /* It takes a targetDir where the files.json are and the destination file. */
  const { targetDir, destDir } = params

  /* Data holder */
  const data = []

  try {
    const files = await fs.readdirSync(targetDir, (err, files) => {
      if(err) console.log(err)

      return files
    })

    files.map(file => {
      data.push(JSON.parse(fs.readFileSync(`${targetDir}${file}`, 'utf8')))
    })

    return fs.writeFileSync(destDir, JSON.stringify(data, null, 2))
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  combineIconsModels
}
