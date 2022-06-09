import gulp from 'gulp';

import plugins from '../config/plugins';
import { path } from '../config/path';
import { isBuild, isDev } from '../../gulpfile';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';
import cleanCss from 'gulp-clean-css';
import autoprefixerCss from 'gulp-autoprefixer';

const groupMediaQueries = require('gulp-group-css-media-queries');

const sass = gulpSass(dartSass);

const scss = () => {
	return gulp.src(path.src.scss, { sourcemaps: isDev })
		.pipe(plugins.plumber(
			plugins.notify.onError({
				title: 'SCSS',
				message: 'Error: <%= error.message %>',
			}),
		))
		.pipe(sass({
			includePaths: ['./node_modules/'],
			outputStyle: 'expanded',
		}))
		.pipe(
			plugins.if(isBuild, groupMediaQueries()),
		)
		.pipe(
			plugins.if(isBuild, autoprefixerCss({
				cascade: true,
				browsers: ['last 4 versions'],
			})),
		)
		.pipe(
			plugins.if(isBuild, gulp.dest(path.build.css)),
		)
		.pipe(
			plugins.if(isBuild, cleanCss()),
		)
		.pipe(rename({
			extname: '.min.css',
		}))
		.pipe(gulp.dest(path.build.css))
		.pipe(plugins.browserSync.reload({ stream: true }));
};

export default scss;