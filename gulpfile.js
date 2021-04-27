'use strict';

// modules for developement mode
const { src, dest, series, gulp, parallel, watch, task } = require('gulp'),
	  less = require('gulp-less'),
	  browserSync = require('browser-sync').create(),
	  php = require('gulp-connect-php'),
	  cache = require('gulp-cache');;

// import cache from 'gulp-cache';


// modules for build mode
const del = require('del'),
	  imagemin = require('gulp-imagemin'),
	  uglify = require('gulp-uglify'),
	  rev = require('gulp-rev'),
	  minifyCss = require('gulp-clean-css'),
	  flatmap = require('gulp-flatmap'),
	  htmlmin = require('gulp-htmlmin'),
	  useref = require('gulp-useref'),
	  gulpif = require('gulp-if'),
	  usemin = require('gulp-usemin');


// Paths to files
const path = './assets',
	  dist = './dev',
	  distAssets = dist + '/assets',
	  distCss = distAssets + '/css',
	  distExtentions = distAssets + '/extentions',
	  distFonts = distAssets + '/fonts',
	  distImages = distAssets + '/images',
	  distJs = distAssets + '/js',
	  pathTpl = path + '/tpl',
	  distTpl = distAssets + '/tpl',
	  pathCfg = path + '/cfg/**/*.*',
	  distCfg = distAssets + '/cfg',
	  pathLib = path + '/lib/**/*.*',
	  distLib = distAssets + '/lib',
	  pathRu = './ru/**/*.*',
	  distRu = dist + '/ru';



// clear all cache
function clearAll(){
	return cache.clearAll();
}


//compile scss into css
function styleUpdate() {
    return src(path + '/_css/*.less')
		   .pipe(less())
		   .pipe(dest(path + '/_css'))
		   .pipe(browserSync.stream());
}

// run php server and watch for updates
function watchChange() {
	php.server({base: './'}, function (){
		    browserSync.init({
		        proxy: 'weddings.local',
				baseDir: "./",
		        // index: "./index.php",
		    });
		    watch(path + '/_css/*.less', styleUpdate);
		    watch('./*.html').on('change', browserSync.reload);
			watch('./*.php').on('change', browserSync.reload);
			watch(path + '/tpl/*.html').on('change', browserSync.reload);
			watch(path + '/_css/*.css').on('change', browserSync.reload);
		    watch(path + '/js/*.js').on('change', browserSync.reload);
			watch(path + '/images/**/*.{png,jpg,gif}').on('change',browserSync.reload);
	});
}



function cleanDist(){
	return del([dist]);
}


function copyFonts(){
	return src(path + '/fonts/**/*.{ttf,woff,eof,svg}*')
		   .pipe(dest(distFonts));

}


function imageMin(){
	return src(path + '/images/**/*.{png,jpg,gif,ico}')
		   .pipe(imagemin({optimizationLevel: 6, progressive: true, interlaced: true}))
		   .pipe(dest(distImages));
}


function moveFiles(from, to){
	return src(from)
		   .pipe(dest(to));
}


function useMin(from, to){
	return  src(from + '/*.{html,php}')
			.pipe(flatmap(function(stream, file){
				return stream
				.pipe(usemin({
					css: [ rev() ],
					html: [ function() { return htmlmin({ collapseWhitespace: true })} ],
					js: [ uglify(), rev() ],
					inlinejs: [ uglify() ],
					inlinecss: [ minifyCss(), 'concat' ]
				}))
			}))
			.pipe(dest(to));
}



function useRef(from, to){
	return src(from + '/*.{html,php}')
		   .pipe(useref())
		   .pipe(gulpif('*.html', htmlmin({ collapseWhitespace: true })))
		   .pipe(gulpif('*.js', uglify(), rev()))
		   .pipe(gulpif('*.css', minifyCss(), rev()))
		   .pipe(dest(to));
}


function minTemplates(){
	return useMin(pathTpl, distTpl);
}

function minFiles(){
	return useMin('.', dist);
}

function moveCfg(){
	return moveFiles(pathCfg, distCfg);
}

function moveLib(){
	return moveFiles(pathLib, distLib);
}

function moveRu(){
	return moveFiles(pathRu, distRu);
}

const develop = series(clearAll, watchChange);

const build = series(cleanDist, parallel(copyFonts, imageMin, minFiles, minTemplates, moveCfg, moveLib, moveRu));

exports.default = develop;
exports.build = build;
