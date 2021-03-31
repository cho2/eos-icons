const fs = require('fs')
const axios = require('axios')
const inquirer = require('inquirer')
const path = require('path')

let nameIcon, svgCollection

// List of icons in ./svg and ./svg/material folders
const eosIconsList = './svg'
const mdIconsList = './svg/material'
const eosIcons = fs.readdirSync(eosIconsList).map((ele) => ele.split('.')[0])
const mdIcons = fs.readdirSync(mdIconsList).map((ele) => ele.split('.')[0])
const svgFilledCollection = [...eosIcons, ...mdIcons]

// List of icons in ./svg-outlined and ./svg-outlined/material folders
const eosOutlinedIconsList = './svg-outlined'
const mdOutlinedIconsList = './svg-outlined/material'
const eosOutlinedIcons = fs
  .readdirSync(eosOutlinedIconsList)
  .map((ele) => ele.split('.')[0])
const mdOutlinedIcons = fs
  .readdirSync(mdOutlinedIconsList)
  .map((ele) => ele.split('.')[0])
const svgOutlinedCollection = [...eosOutlinedIcons, ...mdOutlinedIcons]

const inputForName = async () => {
  try {
    return inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '✅  Enter the new icon name (without .svg): ',
        validate: function (input) {
          const done = this.async()

          if (svgCollection.includes(input)) {
            done(`Already exists`)
          } else {
            done(null, true)
          }
        }
      }
    ])
  } catch (error) {
    console.log(error)
  }
}

const duplicateMDIcon = async (mdIcon) => {
  try {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'answer',
        message: `✅ The SVG/ folder already has an icon with ${mdIcon}.svg name, do you want to mark this new icon as a duplicate?
        Please review the design before confirming.`,
        choices: ['Yes', 'No']
      }
    ])
  } catch (error) {
    console.log(error)
  }
}

const downloadSvgFiles = async (mdIconModelData, newName, targetDirMd) => {
  const filePath = path.resolve(__dirname, `.${targetDirMd}/${newName}.svg`)
  let svgCollectionPath
  if (targetDirMd === './svg/material') {
    svgCollectionPath = 'materialicons'
  } else {
    svgCollectionPath = 'materialiconsoutlined'
  }
  const url = `https://fonts.gstatic.com/s/i/${svgCollectionPath}/${mdIconModelData[0].name}/v${mdIconModelData[0].version}/24px.svg`

  const file = fs.createWriteStream(filePath)
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })
  response.data.pipe(file)
}

const downloadMDFile = async (mdIconList, targetDirMd) => {
  for (const mdIcon of mdIconList) {
    const webMdIconsData = JSON.parse(
      fs.readFileSync('./scripts/md-web-data.json', 'utf8').replace(")]}'", '')
    )
    const mdIconModelData = webMdIconsData.icons.filter(
      (icon) => mdIcon === icon.name
    )

    if (targetDirMd === './svg/material') {
      svgCollection = svgFilledCollection
    } else {
      svgCollection = svgOutlinedCollection
    }

    if (svgCollection.includes(mdIcon)) {
      await duplicateMDIcon(mdIcon).then(async (response) => {
        if (response.answer === 'Yes') {
          addDuplicateName(mdIcon)
        } else {
          await inputForName().then(async (response) => {
            nameIcon = response.name
            await downloadSvgFiles(mdIconModelData, nameIcon, targetDirMd).then(
              () => {
                if (targetDirMd === './svg/material') {
                  createSvgModels(mdIconModelData, nameIcon)
                }
              }
            )
            addDuplicateName(mdIcon)
          })
        }
      })
    } else {
      await downloadSvgFiles(mdIconModelData, mdIcon, targetDirMd).then(() => {
        if (targetDirMd === './svg/material') {
          createSvgModels(mdIconModelData, mdIcon)
        }
      })
    }
  }
}

const addDuplicateName = (duplicateIconName) => {
  const testData = JSON.parse(
    fs.readFileSync('./scripts/duplicated_icons.json', 'utf8')
  )
  testData.push(duplicateIconName)
  fs.writeFileSync(
    `./scripts/duplicated_icons.json`,
    JSON.stringify(testData, null, 2)
  )
}

const createSvgModels = async (mdSvg, nameIcon) => {
  const today = new Date().toLocaleDateString()
  const newObject = {
    name: nameIcon,
    do: '',
    dont: '',
    tags: mdSvg[0].tags,
    category: mdSvg[0].categories,
    type: 'static',
    label: 'None',
    date: today
  }

  fs.writeFileSync(
    `./models/material/${nameIcon}.json`,
    JSON.stringify(newObject, null, 2),
    function (err) {
      if (err) {
        console.log(err)
      }
    }
  )
}

module.exports = {
  downloadMDFile
}
