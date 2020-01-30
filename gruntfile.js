module.exports = function (grunt) {
  const { compareFolders } = require('./scripts/md-name-checker')
  const { combineIconsModels } = require('./scripts/combine-eos-icons')
  const { checkForMissingModelsOrIcons, checkModelKeys } = require('./scripts/models-checker')
  const { createNewModel } = require('./scripts/models-creation')
  const { checkSvgName, renameSvgTo } = require("./scripts/svg-checker")

  //Append path to your svg below
  //EOS-set svg path
  const src_eos_set = ['svg/*.svg']
  //Extended set svg path
  const src_extended_set = ['svg/*.svg', 'svg/extended/*.svg']

  grunt.initConfig({
    webfont: {
      icons: {
        src: src_eos_set,
        dest: 'dist/fonts',
        destCss: 'dist/css',
        options: {
          font: 'eos-icons',
          syntax: 'bootstrap',
          version: '1.0.0',
          ligatures: true,
          normalize: true,
          types: 'woff2,woff,ttf,svg,eot',
          metadata: 'something here',
          templateOptions: {
            baseClass: "eos-icons",
            classPrefix: "eos-",
            template: 'templates/css-template.css',
            iconsStyles: false
          },
          stylesheets: ['css'],
          destHtml: 'dist/',
          htmlDemoTemplate: 'templates/index-template.html',
          htmlDemoFilename: 'index',
          customOutputs: [{
            template: 'templates/glyph-list-template.json',
            dest: 'dist/js/glyph-list.json'
          }]
        }
      },
      iconsExtended: {
        src: src_extended_set,
        dest: 'dist/extended/fonts',
        destCss: 'dist/extended/css',
        options: {
          font: 'eos-icons-extended',
          syntax: 'bootstrap',
          version: '1.0.0',
          ligatures: true,
          normalize: true,
          types: 'woff2,woff,ttf,svg,eot',
          metadata: 'something here',
          templateOptions: {
            baseClass: "eos-icons",
            classPrefix: "eos-",
            template: 'templates/css-template.css',
            iconsStyles: false,
            htmlDemo: false
          },
          stylesheets: ['css'],
          customOutputs: [{
            template: 'templates/glyph-list-template.json',
            dest: 'dist/extended/js/glyph-list-extended.json'
          }]
        }
      }
    },
    copy: {
      material: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'node_modules/material-design-icons',
          dest: 'svg/extended/',
          filter: 'isFile',
          flatten: true,
          src: '{,*/}*/svg/production/*{,*/}_24px.svg',
          rename: function (dest, src) {
            return dest + src.replace('_24px', '').replace('ic_', '')
          }
        }]
      }
    },
    concat: {
      dist: {
        src: ['templates/css-webfont.css'],
        dest: 'templates/css-template.css',
      },
    },
    replace: {
      replace_metadata: {
        src: ['dist/fonts/eos-icons.svg', 'dist/extended/fonts/eos-icons-extended.svg'],
        overwrite: true,
        replacements: [{
          from: /<metadata>(.|\n)*?<\/metadata>/,
          to: "<metadata>Created by EOS Design System</metadata>"
        }]
      }
    },
  })

  /* Looks into the models and svg folders and finds the differences */
  grunt.registerTask('compareModels', function () {
    const done = this.async()

    checkForMissingModelsOrIcons({ modelsSrc: './models', iconsSrc: './svg', animatedSrc: './animated-svg' }).then(async data => {
      const { SVGsMissingModels, ModelsMissingSVGs } = data

      if (SVGsMissingModels.length || ModelsMissingSVGs.length) {
        if (SVGsMissingModels.length) {
          console.log(`⚠️  SVG missing: we found models # ${SVGsMissingModels.map(ele => ele)} # but not the SVG inside /svg.`)

          process.exit(1)
        }

        if (ModelsMissingSVGs.length) {
          console.log(`⚠️  Model missing: we found the SVG # ${ModelsMissingSVGs.map(ele => ele)} # but not the model inside /models. Please create one below.`)

          /* If any model is missing, send it to be created. */
          await createNewModel({ ModelsMissingSVGs }).then(done)
        }
      } else {
        console.log('✅  All SVGs have their corresponding model and vice versa.')
        done()
      }
    })
  })

  /* Find duplictes name between our icons and MD icon set. */
  grunt.registerTask('findDuplicates', function () {
    const done = this.async()

    const mdRepo = './node_modules/material-design-icons'
    const eosRepo = './svg'

    compareFolders({ mdRepo, eosRepo }).then(result => {
      const { error, message } = result

      if (error) {
        console.log(message)
        process.exit(1)
      } else {
        console.log(message)
        done()
      }
    })
  })

  /* Combine all the models into a single file */
  grunt.registerTask('combineAllIconsModels', async function () {
    const done = this.async()

    return combineIconsModels({ targetDir: './models/', destDir: './dist/js/eos-icons.json' })
      .then(done)
  })

  /* Checks for each models to make sure it has all the properties we expect. */
  grunt.registerTask('checkModelsKeys', async function () {
    const done = this.async()

    return checkModelKeys().then(result => {
      return result.length
        ? console.log(`⚠️  Error: model proprieties missing for # ${result.map(ele => ele.name)} #. Please make sure it has: name, do, dont, tags, category and type`)
        : done()
    })
  })

  /* Checks for SVGs names returns the one with a wrong naming convention */
  grunt.registerTask('checkNameConvetion', async function () {
    const done = this.async()
    checkSvgName({ svgDir: "./svg" }).then(async result => {
      for await(icon of result){
        console.log(
          `⚠️  ${icon}.svg is not matching our naming convetion, please rename it below:`
        )
        await renameSvgTo(icon)
      }
    }).then(done)
  })

  grunt.loadNpmTasks('grunt-webfont')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-text-replace')

  grunt.registerTask('default', ['findDuplicates', 'compareModels', 'checkModelsKeys', 'combineAllIconsModels', 'copy:material', 'concat', 'webfont', 'replace'])
}
