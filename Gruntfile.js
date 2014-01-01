var glob = require("glob");

function getTraceurCompiledName(originalFileName) {
  return originalFileName.replace(/.traceur$/, ".traceur.out.js");
}

module.exports = function(grunt) {
  var traceurFiles = glob.sync("assets/javascript/*.traceur").concat(glob.sync("assets/javascript/**/*.traceur"));
  var traceurFileMap = traceurFiles.reduce(function(fileMap, newFile) {
    fileMap[getTraceurCompiledName(newFile)] = [newFile];
    return fileMap;
  }, {});

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    traceur: {
      options: {
        // traceur options here
      },
      all: {
        files: traceurFileMap
      }
    },
    concat: {
      checkers: {
        src: [
          'assets/javascript/global.js',
          'assets/javascript/function.js',
          'assets/javascript/array.js',
          'assets/javascript/vector2.js',
          'assets/javascript/checkers/*.js',
          'assets/javascript/html_checkers/*.js',
          'assets/javascript/main.js'
        ],
        dest: 'assets/javascript/checkers.js'
      }
    },
    clean: {
      concat: ["./assets/javascript/checkers.js"],
      traceur: ["./assets/javascript/*.traceur.out.js", "assets/javascript/**/*.traceur.out.js"]
    }
  });

  grunt.loadNpmTasks('grunt-traceur');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task(s).
  grunt.registerTask('build', ['traceur:all', 'concat:checkers']);
  grunt.registerTask('default', ['build']);

};
