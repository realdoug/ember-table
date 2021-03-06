module.exports = function (grunt) {
  'use strict';

  var path = require('path');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify2');
  grunt.loadNpmTasks('grunt-ember-templates');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-neuter');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    meta: {
      banner: '/*! <%=pkg.name%> - v<%=pkg.version%> (build <%=pkg.build%>) - ' +
        '<%=grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT")%> */'
    },

    // browserify2: {
    //   // Bundle containing all client scripts (WebApp, Ember.js)
    //   table: {
    //     entry: [
    //       './build/src/main.js'
    //     ],
    //     compile: './lib/ember-table-lib.js'
    //   }
    // },

    coffee: {
      srcs: {
        options: {
          bare: true
        },
        expand: true,
        cwd: "src/",
        src: [ "**/*.coffee" ],
        dest: "build/src/",
        ext: ".js"
      },
      app: {
        expand: true,
        cwd: "app/",
        src: [ "**/*.coffee" ],
        dest: "build/app/",
        ext: ".js"
      }
    },

    emberTemplates: {
      options: {
        templateName: function(sourceFile) {
          return sourceFile.replace(/src\/templates\//, '').replace(/app\/templates\//, '');
        }
      },
      'build/src/templates.js': ["src/templates/**/*.hbs"],
      'build/app/templates.js': ["app/templates/**/*.hbs"]
    },

    neuter: {
      options:{
        includeSourceURL: false,
        separator: "\n"
      },
      "dist/ember-table.js":  "build/src/main.js",
      "gh_pages/app.js":      "build/app/app.js"
    },

    clean: [
      "./dist",
      "./build",
      "./gh_pages"
    ],

    jsdoc: {
      all: {
        src: [
          "./build/src/*.js",
          "./build/src/**/*.js"
        ],
        dest: "doc/"
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          next: true,
          require: true
        }
      },
      all: ["Gruntfile.js", "build/src/**/*.js"]
    },

    less: {
      development: {
        options: {
          yuicompress: true
        },
        files: {
          "./dist/ember-table.css": ["./src/css/ember-table.less"],
          "./gh_pages/css/app.css": ["./app/assets/css/app.less"]
        }
      }
    },

    copy: {
      gh_pages: {
        files: [
          {
            src: ['app/index.html'],
            dest: 'gh_pages/index.html'
          }, {
            expand: true,
            flatten: true,
            cwd: 'dependencies/',
            src: ['**/*.js'],
            dest: 'gh_pages/lib'
          }, {
            expand: true,
            flatten: true,
            cwd: 'dependencies/',
            src: ['**/*.css'],
            dest: 'gh_pages/css'
          }, {
            expand: true,
            cwd: 'dependencies/font-awesome/font/',
            src: ['**'],
            dest: 'gh_pages/font'
          }, {
            expand: true,
            cwd: 'app/assets/font/',
            src: ['**'],
            dest: 'gh_pages/font'
          }, {
            expand: true,
            cwd: 'app/assets/img/',
            src: ['**'],
            dest: 'gh_pages/img'
          }
        ]
      },
      tests: {
        files: [
          {
            expand: true,
            flatten: true,
            cwd: 'dependencies/',
            src: ['**/*.js'],
            dest: 'tests/lib'
          }, {
            expand: true,
            flatten: true,
            cwd: 'dependencies/',
            src: ['**/*.css'],
            dest: 'tests/css'
          }
        ]
      }
    },

    qunit: {
      all: ['tests/*.html']
    },

    uglify: {
      file: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
          preserveComments: false,
          beautify: false,
          mangle: true,
          report: 'min'
        },

        files: {
          './dist/ember-table.min.js': [
            // Include dist in bundle
            './dist/ember-table.js'
          ]
        }
      }
    },

    watch: {
      grunt: {
        files: ["Gruntfile.coffee"],
        tasks: ["default"]
      },
      code: {
        files: ["src/**/*.coffee", "app/**/*.coffee", "dependencies/**/*.js"],
        tasks: ["coffee", "neuter"]
      },
      handlebars: {
        files: ["src/**/*.hbs", "app/**/*.hbs"],
        tasks: ["emberTemplates", "neuter"]
      },
      less: {
        files: ["app/assets/**/*.less", "app/assets/**/*.css", "src/**/*.less"],
        tasks: ["less", "copy"]
      },
      copy: {
        files: ["app/index.html"],
        tasks: ["copy"]
      }
    }
  });

  // Default tasks.
  grunt.registerTask("build_srcs", ["coffee:srcs", "emberTemplates", "neuter"]);

  grunt.registerTask("build_app", ["coffee:app", "emberTemplates", "neuter"]);

  grunt.registerTask("default", ["build_srcs", "build_app", "less", "copy", "uglify", "watch"]);

};
