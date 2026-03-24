const esbuild = require('esbuild');
const fs = require('node:fs');
const path = require('node:path');

esbuild
  .build({
    entryPoints: ['src/app.ts'],
    bundle: true,
    outfile: 'dist/app.js',
    treeShaking: false,
    external: ['pg', 'sqlite3', 'tedious', 'pg-hstore', 'sharp'],
    platform: 'node',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: process.env.NODE_ENV === 'production',
  })
  .then(() => {
    const sourceAssetsDir = path.resolve(__dirname, '../src/assets');
    const targetAssetsDir = path.resolve(__dirname, '../dist/assets');

    if (fs.existsSync(sourceAssetsDir)) {
      fs.mkdirSync(targetAssetsDir, { recursive: true });
      fs.cpSync(sourceAssetsDir, targetAssetsDir, { recursive: true });
    }
  })
  .catch(() => process.exit(1));
