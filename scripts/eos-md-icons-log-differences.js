const fs = require('fs')
const axios = require('axios')
const path = require('path')

const downloadFile = async () => {
  const filePath = path.resolve(__dirname, 'md-web-data.json')
  axios({
    method: 'get',
    url: 'https://fonts.google.com/metadata/icons',
    responseType: 'stream'
  }).then((response) => {
    response.data.pipe(fs.createWriteStream(filePath))
  })
}

const eosMdIconsDifferences = async (params) => {
  const { targetDirMd, icons } = params

  try {
    const mdIcons = await fs
      .readdirSync(targetDirMd, (err, filenames) => filenames)
      .map((ele) => ele.replace(/\.[^/.]+$/, ''))
    const webMdIconsData = JSON.parse(
      fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", '')
    )
    const webMdIconsCollection = webMdIconsData.icons.map((ele) => ele.name)

    const missingIconsInEos = iconsDifferences(webMdIconsCollection, mdIcons)
    const missingIconsInMD = iconsDifferences(mdIcons, webMdIconsCollection)
    const allMissingIconsInEos = iconsDifferences(missingIconsInEos, icons)

    console.log(
      `======= ${allMissingIconsInEos.length} New icons MD has that EOS doesn't =======`
    )
    console.dir(allMissingIconsInEos, { maxArrayLength: null })
    console.log(
      `======= ${missingIconsInMD.length} Old Md icons they have removed and EOS still has =======`
    )
    console.dir(missingIconsInMD, { maxArrayLength: null })
  } catch (error) {
    console.log(error)
    console.log(
      "Please run 'grunt eosMdIconsDifferencesLog' again to see the result."
    )
  }
}

const iconsDifferences = (array1, array2) =>
  array1.filter((val) => !array2.includes(val))

module.exports = {
  eosMdIconsDifferences,
  downloadFile
}
