const esbuild = require("esbuild");

const production = process.argv.includes('--production');
const watch = process.argv.includes('--watch');

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
	name: 'esbuild-problem-matcher',

	setup(build) {
		build.onStart(() => {
			console.log('[watch] build started');
		});
		build.onEnd((result) => {
			result.errors.forEach(({ text, location }) => {
				console.error(`✘ [ERROR] ${text}`);
				console.error(`    ${location.file}:${location.line}:${location.column}:`);
			});
			console.log('[watch] build finished');
		});
	},
};

async function main() {
	const ctx = await esbuild.context({
		entryPoints: [
			'src/extension.ts',
			'src/js/glow.ts'
		],
		bundle: true,
		format: 'cjs',
		minify: production,
		sourcemap: !production,
		sourcesContent: false,
		platform: 'node',
		outdir: 'dist',
		entryNames: '[dir]/[name]',
		external: ['vscode'],
		logLevel: 'silent',
		plugins: [
			/* add to the end of plugins array */
			esbuildProblemMatcherPlugin,
		],
	});
	if (watch) {
		await ctx.watch();

		// Watch src/css for changes and trigger rebuild
		const fs = require('fs');
		const path = require('path');
		const chokidar = require('chokidar');

		const cssWatcher = chokidar.watch(path.join(__dirname, 'src', 'css'), {
			ignoreInitial: true,
		});

		cssWatcher.on('all', async () => {
			console.log('[watch] src/css changed, rebuilding...');
			await ctx.rebuild();

			// Re-copy CSS
			const srcCss = path.join(__dirname, 'src', 'css');
			const distCss = path.join(__dirname, 'dist', 'css');
			fs.mkdirSync(distCss, { recursive: true });
			fs.cpSync(srcCss, distCss, { recursive: true });
		});

		// Also watch src/js for changes and copy to dist/js
		const jsWatcher = chokidar.watch(path.join(__dirname, 'src', 'js'), {
			ignoreInitial: true,
		});

		jsWatcher.on('all', async () => {
			console.log('[watch] src/js changed, rebuilding...');
			await ctx.rebuild();

			const srcJs = path.join(__dirname, 'src', 'js');
			const distJs = path.join(__dirname, 'dist', 'js');
			fs.mkdirSync(distJs, { recursive: true });
		});
	} else {
		await ctx.rebuild();
		await ctx.dispose();
		// Copy static assets (e.g., CSS)
		const fs = require('fs');
		const path = require('path');
		const srcCss = path.join(__dirname, 'src', 'css');
		const distCss = path.join(__dirname, 'dist', 'css');
		fs.mkdirSync(distCss, { recursive: true });
		fs.cpSync(srcCss, distCss, { recursive: true });
		// Also copy JS output
		const srcJs = path.join(__dirname, 'src', 'js');
		const distJs = path.join(__dirname, 'dist', 'js');
		fs.mkdirSync(distJs, { recursive: true });
	}
}

main().catch(e => {
	console.error(e);
	process.exit(1);
});
