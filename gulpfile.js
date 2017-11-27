const
  gulp = require('gulp'),
  swPrecache = require('sw-precache');

const outPath = './dist';

gulp.task('service-worker', () => {
  const swPath = `${outPath}/sw.js`;

  swPrecache.write(swPath, {
    staticFileGlobs: ['dist/**/*.{js,html,css,png,jpg,gif}'],
    stripPrefix: 'dist'
    // runtimeCaching: [{
    //   urlPattern: /^https:\/\/example\.com\/api/,
    //   handler: 'networkFirst'
    // }]
  });
});
