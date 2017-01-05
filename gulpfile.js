// Load plugins
var gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    sourcemaps = require('gulp-sourcemaps'),
    babel = require('gulp-babel'),
    browserSync = require('browser-sync').create();

var buildPath = 'src';

// error handling
function handleError(err) {
    console.log('ERROR HANDLER: ', err.toString());
    this.emit('end');
}

//Styles
gulp.task('styles:build', function () {
    return gulp.src(buildPath + '/less/*.less')

        .pipe(less())
        .on('error', handleError)

        .pipe(autoprefixer('last 2 version'))
        .on('error', handleError)

        .pipe(cssnano({
            reduceIdents: false
        }))
        .on('error', handleError)

        .pipe(gulp.dest('dist/css'))
        .on('error', handleError)

        .pipe(notify({message: 'Styles Build task complete'}))
        .on('error', handleError);
});

gulp.task('styles:dev', function () {
    return gulp.src(buildPath + '/less/*.less')

        .pipe(sourcemaps.init())
        .on('error', handleError)

        .pipe(less())
        .on('error', handleError)

        .pipe(autoprefixer('last 2 version'))
        .on('error', handleError)

        .pipe(sourcemaps.write('.'))
        .on('error', handleError)

        .pipe(gulp.dest('dist/css'))
        .on('error', handleError)

        .pipe(notify({message: 'Styles task complete'}))
        .on('error', handleError)

        .pipe(browserSync.stream({match: '**/*.css'}));
});

// Scripts
gulp.task('scripts:build', function () {
    return gulp.src([
            `!${buildPath}/js/vendor/*.js`,
            buildPath + '/js/*/**/*.js',
            buildPath + '/js/*.js',
        ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', handleError)

        .pipe(concat('app.js'))
        .on('error', handleError)

        .pipe(uglify())
        .on('error', handleError)

        .pipe(gulp.dest('dist/js'))
        .on('error', handleError)

        .pipe(notify({message: 'Scripts Build task complete'}))
        .on('error', handleError);
});
gulp.task('scripts:dev', function () {
    return gulp.src([
            `!${buildPath}/js/vendor/*.js`,
            buildPath + '/js/*/**/*.js',
            buildPath + '/js/*.js',
        ])
        .pipe(sourcemaps.init())

        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', handleError)

        .pipe(concat('app.js'))
        .on('error', handleError)

        .pipe(sourcemaps.write('.'))
        .on('error', handleError)

        .pipe(gulp.dest('dist/js'))
        .on('error', handleError)

        .pipe(notify({message: 'Scripts task complete'}))
        .on('error', handleError)

        .pipe(browserSync.stream());
});
gulp.task('scripts:vendor', function () {
    return gulp.src([
            buildPath + '/js/vendor/*.js'
        ])
        .pipe(concat('vendor.js'))
        .on('error', handleError)

        .pipe(uglify())
        .on('error', handleError)

        .pipe(gulp.dest('dist/js'))
        .on('error', handleError)

        .pipe(notify({message: 'Scripts Vendor Build task complete'}))
        .on('error', handleError);
});

// Images
gulp.task('images', function () {
    return gulp.src(buildPath + '/images/**/*')
        .pipe(cache(imagemin({optimizationLevel: 3, progressive: true, interlaced: true})))
        .on('error', handleError)

        .pipe(gulp.dest('dist/images'))
        .on('error', handleError);
});

// HTML
gulp.task('html:build', function () {
    return gulp.src(buildPath + '/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true,
            preserveLineBreaks: true,
        }))
        .on('error', handleError)

        .pipe(rename('index.html'))
        .on('error', handleError)

        .pipe(gulp.dest('dist/'))
        .on('error', handleError);
});

gulp.task('html:dev', function () {
    return gulp.src(buildPath + '/*.html')
        .pipe(rename('index.html'))
        .on('error', handleError)
        .pipe(gulp.dest('dist/'))
        .on('error', handleError)
        .pipe(browserSync.stream());
});

gulp.task('cordova:build', function () {
    return gulp.src([
        'dist/**/*'
        ])
        .on('error', handleError)
        .pipe(gulp.dest('cordova/www'))
        .on('error', handleError)
});

// Other Assets
gulp.task('assets', function () {
    return gulp.src(buildPath + '/assets/**/*')
        .pipe(gulp.dest('dist/'));
});

// Clean
gulp.task('clean', function () {
    return del(['dist']);
});

// Default task
gulp.task('default', ['clean'], function () {
    gulp.start('styles:dev', 'scripts:vendor', 'scripts:dev', 'images', 'html:dev', 'assets');
});

gulp.task('build', ['clean'], function () {
    gulp.start('styles:build', 'scripts:vendor', 'scripts:build', 'images', 'html:build', 'assets');
});

gulp.task('cordova', ['build'], function () {
    gulp.start('cordova:build');
});

// Watch
gulp.task('watch', function () {

    console.log('--- ## --- Let\'s get ready to create something awesome! --- ## ---');

    browserSync.init({
        server: "./dist"
    });

    // Watch .less files
    gulp.watch(buildPath + '/less/**/*.less', ['styles:dev']);

    // Watch .js files
    gulp.watch(buildPath + '/js/**/*.js', ['scripts:dev']);

    // Watch image files
    gulp.watch(buildPath + '/images/**/*', ['images']);

    // Watch html files
    gulp.watch(buildPath + '/**/*.html', ['html:dev']);
});
