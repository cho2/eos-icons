const fs = require('fs-extra')

const combineIconsModels = async (params) => {
  /* It takes a targetDir where the files.json are and the destination file. */
  const { targetDirEos, targetDirMd, destDir } = params

  /* Data holder */
  const data = []

  try {
    const filesEos = await fs
      .readdirSync(targetDirEos, (err, files) => {
        if (err) console.log(err)

        return files
      })
      .map((file) => {
        if (file.includes('.json')) {
          data.push(
            JSON.parse(fs.readFileSync(`${targetDirEos}${file}`, 'utf8'))
          )
        }
      })

    const filesMd = await fs
      .readdirSync(targetDirMd, (err, files) => {
        if (err) console.log(err)

        return files
      })
      .map((file) => {
        if (file.includes('.json')) {
          data.push(
            JSON.parse(fs.readFileSync(`${targetDirMd}${file}`, 'utf8'))
          )
        }
      })

    return fs.writeFileSync(destDir, JSON.stringify(data, null, 2))
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  combineIconsModels
}
