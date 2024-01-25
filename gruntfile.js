module.exports = function (grunt) {
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    clean: ["dist"],
    cssmin: {
      cdn: {
        options: {
          banner: "",
        },
        files: {
          "dist/binge.min.css": ["**/server/css/**/*.css"],
        },
      },
      online: {
        options: {
          banner: "",
        },
        files: {
          "dist/app.min.css": ["css/**/*.css"],
        },
      },
    },
    uglify: {
      options: {
        compress: true,
      },
      cdn: {
        src: ["server/js/**/*.js"],
        dest: "dist/binge.min.js",
      },
      online: {
        src: ["js/**/*.js"],
        dest: "dist/app.min.js",
      },
    },
    copy: {
      cdn: {
        files: [
          {
            expand: true,
            cwd: "server/css/icons/webfonts",
            src: ["**/*"],
            dest: "dist/assets/icons",
          },
          {
            expand: true,
            cwd: "server/img/",
            src: ["**/*"],
            dest: "dist/assets/imgs",
          },
          {
            expand: true,
            cwd: "server/translate/",
            src: ["**/*"],
            dest: "dist/assets/translate",
          },
        ],
      },
      online: {
        files: [
          {
            expand: true,
            cwd: "css/fonts/",
            src: ["**/*"],
            dest: "dist/fonts",
          },
          {
            expand: true,
            cwd: "img/",
            src: ["**/*"],
            dest: "dist/img",
          },
          {
            src: ["index.html", "config.xml", "icon.png"],
            dest: "dist/",
          },
        ],
      },
      offline: {
        files: [
          {
            expand: true,
            cwd: "server/",
            src: ["**/*"],
            dest: "dist/server",
          },
          {
            expand: true,
            cwd: "img/",
            src: ["**/*"],
            dest: "dist/img",
          },
          {
            expand: true,
            cwd: "css/",
            src: ["**/*"],
            dest: "dist/css",
          },
          {
            expand: true,
            cwd: "js/",
            src: ["**/*"],
            dest: "dist/js",
          },
          {
            src: ["index.html", "config.xml", "icon.png"],
            dest: "dist/",
          },
        ],
      },
    },
    "json-minify": {
      cdn: {
        files: 'dist/assets/translate/*.json'
      }
    },
    "string-replace": {
      cdn: {
        files: {
          "dist/": "dist/*",
        },
        options: {
          replacements: [
            {
              pattern: /server\/img\//g,
              replacement:
                "https://github.com/anmspro/Binge-Samsung-TV-App-Tizen/assets/imgs/",
            },
            {
              pattern: /url\(webfonts\//g,
              replacement:
                "url(https://github.com/anmspro/Binge-Samsung-TV-App-Tizen/assets/icons/",
            },
            {
              pattern: /server\/translate\//g,
              replacement:
                "url(https://github.com/anmspro/Binge-Samsung-TV-App-Tizen/assets/translate/",
            },
          ],
        },
      },
      online: {
        files: {
          "dist/": "dist/index.html",
        },
        options: {
          replacements: [
            {
              pattern: /<!-- start css -->([\S\s]*?)<!-- end css -->/g,
              replacement: `<script src="app.min.js"></script>
    <link rel="stylesheet" href="app.min.css" />
    <link rel="stylesheet" href="https://github.com/anmspro/Binge-Samsung-TV-App-Tizen/binge.min.css" />`,
            },
            {
              pattern: /<!-- start js -->([\S\s]*?)<!-- end js -->/g,
              replacement:
                '<script src="https://github.com/anmspro/Binge-Samsung-TV-App-Tizen/binge.min.js"></script>',
            },
          ],
        },
      },
    },
    babel: {
      options: {
        presets: ['@babel/preset-env']
      },
      offline: {
        files: [{
          expand: true,
          cwd: 'js/',  // source directory
          src: ['**/*.js'],
          dest: 'dist/js/'  // destination directory
        }]
      }
    },
  });
  grunt.registerTask("cdn", [
    "clean",
    "uglify:cdn",
    "cssmin:cdn",
    "copy:cdn",
    "json-minify:cdn",
    "string-replace:cdn",
  ]);
  grunt.registerTask("online", [
    "clean",
    "uglify:online",
    "cssmin:online",
    "copy:online",
    "string-replace:online",
  ]);
  grunt.registerTask("offline", ["clean",
  "babel:offline",
   "copy:offline",
   ,]);
};
