
module.exports = gruntConfig;

function gruntConfig(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({

    concurrent: {
      options: {
        logConcurrentOutput: true
      },

      serve: [
        'shell:serve',
        'open:dev'
      ]
    },


    clean: {
      build: ['public/', 'db.json']
    },


    shell: {
      options: {
        stderr: true
      },
      serve: {
        command: 'hexo serve --silent'
      },
      build: {
        command: 'hexo generate'
      },
      deployGithub: {
        command: 'hexo deploy'
      }
    },


    open: {
      dev: {
        path: 'http://127.0.0.1:4000/',
        app: 'chrome'
      }
    },


    copy: {
      fullPages: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'full-pages/',
            src: ['**'],
            dest: 'public/work/'
          }
        ]
      }
    }
  });


  grunt.registerTask('default', []);

  grunt.registerTask('build', [
    'clean:build',
    'shell:build',
    'copy:fullPages'
  ]);

  grunt.registerTask('serve', [ 'concurrent:serve' ]);

  grunt.registerTask('deploy', [
    'build',
    'shell:deployGithub'
  ]);

}
