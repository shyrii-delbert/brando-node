require('esbuild').build({
  entryPoints: ['src/app.ts'],
  bundle: true,
  outfile: 'dist/app.js',
  treeShaking: false,
  external: ['pg', 'sqlite3', 'tedious', 'pg-hstore', 'sharp'],
  platform: 'node',
  sourcemap: true,
  minify: process.env.NODE_ENV === 'production',
}).catch(() => process.exit(1));
