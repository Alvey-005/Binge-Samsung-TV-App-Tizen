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
          "dist/crunchyroll.min.css": ["**/server/css/**/*.css"],
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
        dest: "dist/crunchyroll.min.js",
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
            src: ["index.html", "Binge_130.png"],
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
            src: ["index.html", "Binge_130.png"],
            dest: "dist/",
          },
        ],
      },
      webos: {
        files: [
          {
            src: ["appinfo.json"],
            dest: "dist/",
          },
        ],
      },
    },
    "json-minify": {
      cdn: {
        files: "dist/assets/translate/*.json",
      },
    },
    "string-replace": {
      cdn: {
        files: {
          "dist/": "dist/*",
        },
        options: {
          replacements: [
            
          ],
        },
      },
      online: {
        files: {
          "dist/": "dist/index.html",
        },
        options: {
          replacements: [
           
          ],
        },
      },
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
  grunt.registerTask("online-webos", [
    "clean",
    "uglify:online",
    "cssmin:online",
    "copy:online",
    "copy:webos",
    "string-replace:online",
  ]);
  grunt.registerTask("offline-webos", ["clean", "copy:offline", "copy:webos"]);
};