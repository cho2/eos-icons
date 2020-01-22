const inquirer = require('inquirer');

const createModel = async params => {
  try {
    return inquirer
      .prompt([
        {
          type: 'input',
          name: 'do',
          message: '✅  Indicate the doing:',
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
          message: '⚠️  Indicate the donts:',
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
          message: '🏷  Indicate the tags separated by comma (ex: tag1, tag2, tag3):',
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
          message: '🗄  Indicate the category:',
          choices: ['cloud', 'kubernetes', 'data']
        },
        {
          type: 'rawlist',
          name: 'type',
          message: '⚙️  Indicate the type:',
          choices: ['static', 'animated']
        },
      ])
  } catch (error) {
    console.log('createModel(): ', error);
  }
}

module.exports = {
  createModel
}