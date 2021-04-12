const fs = require('fs')
const { readFilesInFolder } = require('./utilities')

/* The MD object. Let's clean it up. */
const webMdIconsData = JSON.parse(
  fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", '')
)
const webMdIconsCollection = webMdIconsData.icons
  .filter((icon) => readFilesInFolder('/svg/material').includes(icon.name))
  .filter((icon) => !readFilesInFolder('/models/material').includes(icon.name))

webMdIconsCollection.forEach((icon) => {
  const newObject = {
    name: icon.name,
    do: '',
    dont: '',
    tags: icon.tags,
    category: icon.categories,
    type: 'static'
  }

  fs.writeFile(
    `./models/material/${icon.name}.json`,
    JSON.stringify(newObject, null, 2),
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
})
