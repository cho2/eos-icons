const fs = require('fs');
const axios = require('axios')
const path = require('path')

function downlaodFile() {
  const filePath = path.resolve(__dirname, 'mdfile', 'md-webs.json')
  
  axios({
    method: "get",
    url: "https://fonts.google.com/metadata/icons",
    responseType: "stream"
  }).then(function (response) {
    response.data.pipe(fs.createWriteStream(filePath));
  });
}

const eosMdIconsDifferences = async params => {
 downlaodFile()
  const { targetDirMd } = params 

  try {
    const mdIcons = await fs.readdirSync(targetDirMd, (err, filenames) => filenames).map(ele => ele.replace(/\.[^/.]+$/, ""))
    const webMdIconsData = JSON.parse(fs.readFileSync('./scripts/mdfile/md-web.json', 'utf8').replace(")]}'", ''))
		const webMdIconsCollection = webMdIconsData.icons.map(ele => ele.name);

    const missingIconsInEos = iconsDifferences(webMdIconsCollection, mdIcons)

    console.log(missingIconsInEos)

  } catch (error) {
    console.log(error)
  }
}

const iconsDifferences = (array1, array2) => array1.filter(val => !array2.includes(val));
module.exports = {
  eosMdIconsDifferences
}
