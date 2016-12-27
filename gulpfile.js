const gulp = require("gulp"),
      tsc  = require("gulp-typescript"),
      maps = require('gulp-sourcemaps'),
      exec = require("child_process").exec;

gulp.task("build", function () {

  const src     = ["src/**/*.ts", "typings/index.d.ts"];
  const project = tsc.createProject("tsconfig.json");

  return gulp.src(src)
      .pipe(maps.init())
      .pipe(tsc(project)).js
      .pipe(maps.write(".", {sourceRoot: "../src"}))
      .pipe(gulp.dest("build"));
});

gulp.task("run", ["build"], function (cb) {

  exec('node build/main.js', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});