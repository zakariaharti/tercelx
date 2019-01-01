/**
 * Entry Script
 */

if (process.env.NODE_ENV === 'production') {
  process.env.webpackAssets = JSON.stringify(require('./build/client/manifest.json'));
  process.env.webpackChunkAssets = JSON.stringify(require('./build/client/chunk-manifest.json'));
  // In production, serve the webpacked server file.
  require('./build/server.bundle.js');
} else {
  require('./server/index.tsx');
}
