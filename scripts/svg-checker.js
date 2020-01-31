const fs = require("fs");
const inquirer = require("inquirer");
const { readFilesAndCleanNames } = require("./models-checker")

const reg = /^[a-z]+(_[a-z]+)*$/g

/* Runs every SVG name aginst a regular expression */
const checkSvgName = async params => {
  const { svgDir } = params

  /* Reads all the svg files and remove the .svg from the name */
  const existentIcons = await readFilesAndCleanNames(svgDir)

  /* Checks that the name match the regex, if not, returns it */
  return existentIcons.filter(ele => ele.match(reg) === null)
}

const renameSvgTo = async originalFile => {
  try {
    return inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: 'Indiquete a new name (without .svg): ',
        validate: function(input) {
          const done = this.async()

          !input.length
            ? done(`Field can't be blank`)
            : !input.match(reg)
            ? done(`Wrong naming convention, please use: filename or file_name`)
            : done(null, true)
        }
      }
    ]).then(data => {
      return fs.rename(
        `./svg/${originalFile}.svg`,
        `./svg/${data.name}.svg`,
        function(err) {
          if (err) console.log("ERROR: " + err);
          console.log(`File was renamed from ${originalFile}.svg to ${data.name}.svg`);
        }
      )
    })
  } catch (error) {
    console.log("inputForModel(): ", error)
  }
};


module.exports = {
  checkSvgName,
  renameSvgTo
}
