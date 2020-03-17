const fs = require('fs');

/* create array of our current icons and models so we remove them from the MD object */
const mdIcons = fs.readdirSync('./svg/material', (err, filenames) => filenames).map(ele => ele.replace(/\.[^/.]+$/, ""))
const mdModelsCreated = fs.readdirSync('./models/material', (err, filenames) => filenames).map(ele => ele.replace(/\.[^/.]+$/, ""))

/* The MD object. Let's clean it up. */
const webMdIconsData = JSON.parse(fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", ''))
const webMdIconsCollection = webMdIconsData.icons.filter(icon => mdIcons.includes(icon.name)).filter(icon => !mdModelsCreated.includes(icon.name))


webMdIconsCollection.forEach(icon => {
  const newObject = {
    "name": icon.name,
    "do": "",
    "dont": "",
    "tags": icon.tags,
    "category": icon.categories,
    "type": "static"
  }

  fs.writeFile(`./models/material/${icon.name}.json`, JSON.stringify(newObject, null, 2), function (err) {
    if (err) {
      console.log(err)
    }
  });
})
