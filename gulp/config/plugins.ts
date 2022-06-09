import plumber from 'gulp-plumber';
import browserSyncPlugin from 'browser-sync';
import newer from 'gulp-newer';
import ifPlugin from 'gulp-if';

const browserSync = browserSyncPlugin.create();

const notify = require('gulp-notify');

const plugins = {
	notify: notify,
	plumber: plumber,
	browserSync: browserSync,
	newer: newer,
	if: ifPlugin,
};

export default plugins;