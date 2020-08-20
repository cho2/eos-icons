const fs = require('fs');
const axios = require('axios')
const path = require('path')

const downloadSVGFile = async (iconList) => { 
  const webMdIconsData = JSON.parse(fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", ''))
  const mdSvgCollection = webMdIconsData.icons.filter(icon => iconList.includes(icon.name))

  const downloadFiles = async (mdSvgCollection) => {
    for (const mdSvg of mdSvgCollection) {
      let filePath = path.resolve(__dirname, `../svg/material/${mdSvg.name}.svg`)
      let name = mdSvg.name + '.svg'
      let url = `https://fonts.gstatic.com/s/i/materialicons/${mdSvg.name}/v${mdSvg.version}/24px.svg`
      let file = fs.createWriteStream(filePath)
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
      })
      response.data.pipe(file)
    }
  }

  downloadFiles(mdSvgCollection)
}

const createSVGModels = async (iconList) => {

  const webMdIconsData = JSON.parse(fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", ''))
  const mdSvgModelCollection = webMdIconsData.icons.filter(icon => iconList.includes(icon.name))
  
  mdSvgModelCollection.forEach(icon => {
    console.log(icon.name)
    const newObject = {
      "name": icon.name,
      "do": "",
      "dont": "",
      "tags": icon.tags,
      "category": icon.categories,
      "type": "static"
    }

    fs.writeFileSync(`./models/material/${icon.name}.json`, JSON.stringify(newObject, null, 2), function (err) {
      if (err) {
        console.log(err)
      }
    });
  })
}

module.exports = {
  downloadSVGFile,
  createSVGModels
}


