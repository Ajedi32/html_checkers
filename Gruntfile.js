module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    traceur: {
      options: {
        // traceur options here
      },
      custom: {
        files:{
          'assets/javascript/checkers.js': [
            'assets/javascript/global.js',
            'assets/javascript/function.js',
            'assets/javascript/array.js',
            'assets/javascript/vector2.js',
            'assets/javascript/checkers/*.js',
            'assets/javascript/html_checkers/*.js',
            'assets/javascript/main.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-traceur');

  // Default task(s).
  grunt.registerTask('default', ['traceur']);

};
