module.exports = function (grunt) {
  const sass = require('node-sass');

  //Append path to your svg below
  //EOS-set svg path
  const src_eos_set=['svg/*.svg'];
  //Extended set svg path
  const src_extended_set=['svg/*.svg', 'svg/extended/*.svg'];

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
            dest: 'dist/extended/js/glyph-list.json'
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
            return dest + src.replace('_24px', '').replace('ic_', '');
          }
        }]
      }
    },
    sass: {
      options: {
        implementation: sass
      },
      dist: {
        files: {
          'templates/sass-compiled.css': 'scss/index.scss'
        }
      }
    },
    concat: {
      dist: {
        src: ['templates/css-webfont.css', 'templates/sass-compiled.css'],
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
  });

  /**
  * Add animated icons objects in the exported collection
  *
  * Since we only have 2 animated icons, we will manually add the animated icons
  * to the glyph list json
  *
  * This will allow us to consume them in EOS
  */

  grunt.registerTask('addanimated', function (key, value) {
    var projectFile = "./dist/js/glyph-list.json";
    // get file as json object
    var project = grunt.file.readJSON(projectFile);
    var animatedIconsArray = ['loading', 'installing'];

    //edit the value of json object
    project.animatedIcons = animatedIconsArray;

    //serialize it back to file
    grunt.file.write(projectFile, JSON.stringify(project, null, 2));
  });

  grunt.loadNpmTasks('grunt-webfont');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-text-replace');

  grunt.registerTask('default', ['copy:material', 'sass', 'concat', 'webfont', 'replace', 'addanimated']);

};
