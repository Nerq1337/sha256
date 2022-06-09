import plugins from '../config/plugins';
import { distPath } from '../config/path';

const server = () => {
	plugins.browserSync.init({
		server: {
			baseDir: distPath,
		},
		notify: false,
		port: 3000,
	});
};

export default server;