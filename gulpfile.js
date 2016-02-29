// Make Sure you have Nodejs & gulp installed, If so..
// Run "npm intall", to get all the dependencies.

var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var watch= require('gulp-watch');
var autoprefixer = rquire('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: "./"
    }
  });
});

/****        For Reloading the browser      ****/

gulp.task('bs-reload', function () {
  browserSync.reload();
});

/****        For Image Optimization        ****/

gulp.task('images', function(){
  gulp.src('src/images/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images/'));
});

/******
    var sassOptions = {
      errLogToConsole: true,
      outputStyle: 'expanded'
    };

    gulp.task('sass', function () {
      return gulp
        .src(input)
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest(output));
    });
******/

/****       For Sass to CSS Styles along side with all the prefixes        ****/

gulp.task('styles', function(){
  gulp.src(['app/styles/**/*.scss'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({outputStyle:'expanded'}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('dist/styles/'))
    .pipe(browserSync.reload({stream:true}));
});

/****       For JS files, Concatinating--Renaming--Uglifying        ****/

gulp.task('scripts', function(){
  return gulp.src('src/scripts/**/*.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts/'))
    .pipe(browserSync.reload({stream:true}));
});

/****       Letting gulp watch all the tasks        ****/

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("app/styles/**/*.scss", ['styles']);
  gulp.watch("src/scripts/**/*.js", ['scripts']);
  gulp.watch("*.html", ['bs-reload']);
});
