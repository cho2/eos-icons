const inquirer = require('inquirer');
const fs = require('fs');

const createModel = async params => {
  const { iconName } = params

  try {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'do',
          message: 'Indicate the doing:',
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
          message: 'Indicate the donts:',
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
          message: 'Indicate the tags separated by comma (ex: tag1, tag2, tag3):',
          validate: function(input){
            const done = this.async();

            input.length
              ? done(null, true)
              : done(`Field can't be blank`);
          }
        },
        {
          type: 'rawlist',
          name: 'category',
          message: 'Indicate the category:',
          choices: ['Cloud', 'Desktop', 'Axure', 'Cloud', 'Desktop', 'Axure']
        },
      ]).then(response => {
        const iconModel = [{ name: iconName, ...response }].reduce((acc, cur) => {
          acc = {
            ...cur,
            tags: [cur.tags],
            category: [cur.category]
          }

          return acc
        }, {})

        const saveFile = fs.writeFile('file.json', JSON.stringify(iconModel, null, 2), err => {
          if (err) throw err;

          return console.log(`File saved:  ../models/${iconName}.json`)
        })

        return saveFile

      })
  } catch (error) {
    console.log('createModel(): ', error);
  }
}

createModel({ iconName: 'test'})