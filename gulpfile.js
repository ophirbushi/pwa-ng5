const
  gulp = require('gulp'),
  swPrecache = require('sw-precache');

const srcPath = './src';

gulp.task('service-worker', () => {
  const swPath = `${srcPath}/sw.js`;

  swPrecache.write(swPath, {
    staticFileGlobs: ['dist/**/*.{js,html,css,png,jpg,gif}'],
    stripPrefix: 'dist',
    // runtimeCaching: [{
    //   urlPattern: /^https:\/\/example\.com\/api/,
    //   handler: 'networkFirst'
    // }]
  });
});
