const inquirer = require('inquirer');
const fs = require('fs');

const inputForModel = async () => {
  try {
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'do',
          message: '✅  Indicate the "do": ',
          validate: function(input){
            const done = this.async();

            input.length
              ? done(null, true)
              : done(`Field can't be blank`);
          }
        },
        {
          type: 'input',
          name: 'dont',
          message: `⚠️  Indicate the "don't": `,
          validate: function(input){
            const done = this.async();

            input.length
              ? done(null, true)
              : done(`Field can't be blank`);
          }
        },
        {
          type: 'input',
          name: 'tags',
          message: '🏷  Indicate the tags separated by comma (ex: tag1, tag2, tag3): ',
          validate: function(input){
            const done = this.async();

            input.length
              ? done(null, true)
              : done(`Field can't be blank`);
          }
        },
        {
          type: 'list',
          name: 'category',
          message: '🗄  Indicate the category: ',
          choices: ['miscellaneous', 'kubernetes', 'communication']
        },
        {
          type: 'rawlist',
          name: 'type',
          message: '⚙️  Indicate the type:',
          choices: ['static', 'animated']
        },
      ])
  } catch (error) {
    console.log('inputForModel(): ', error);
  }
}

const createNewModel = async ({ ModelsMissingSVGs }) => {
  try {
    for (let i = 0; i < ModelsMissingSVGs.length; i++) {
      console.log('===============================================')
      console.log(`Add the information of the model for ${ModelsMissingSVGs[i]}.svg:`)

      await inputForModel().then(async response => {
        const iconModel = [{ name: ModelsMissingSVGs[i], ...response }].reduce((acc, cur) => {
          const arrayOftags = cur.tags.split(',')

          acc = {
            ...cur,
            do: `<ul><li>${[cur.do]}</li></ul>`,
            dont: `<ul><li>${[cur.dont]}</li></ul>`,
            tags: [...arrayOftags]
          }

          return acc
        }, {})

        fs.writeFileSync(`models/${ModelsMissingSVGs[i]}.json`, JSON.stringify(iconModel, null, 2))

        return console.log(`File saved:  ../models/${ModelsMissingSVGs[i]}.json. Please always check it manually to be sure.`)
      })
    }
  } catch (error) {
    console.log('ERROR: createNewModel(): ', error);
  }
}

module.exports = {
  createNewModel
}