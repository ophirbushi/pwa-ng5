const
  fs = require('fs'),
  gulp = require('gulp'),
  concatFilenames = require('gulp-concat-filenames'),
  insert = require('gulp-insert');

const src = './src';
const dist = './dist';
const temp = './temp';

gulp.task('file-names', () => {
  const concatFilenamesOptions = {
    root: dist,
    template: fileName => `"${fileName}",`
  };

  return gulp
    .src(`${dist}/**/*.*`)
    .pipe(concatFilenames('filenames.txt', concatFilenamesOptions))
    .pipe(gulp.dest(temp));
});

gulp.task('templates', ['file-names'], function () {
  const filenames = fs.readFileSync(`${temp}/filenames.txt`);

  return gulp.src([`${src}/sw.js`])
    .pipe(insert.prepend(`const urlsToCache = ['/', ${filenames.toString('utf8')}]; `))
    .pipe(gulp.dest(dist));
});

gulp.task('default', ['templates'], () => {});
