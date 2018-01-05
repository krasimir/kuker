var zipFolder = require('zip-folder');
var manifest = require(__dirname + '/../src/extension-static/manifest.json');

zipFolder(__dirname + '/../build', __dirname + '/../packages/kuker_' + manifest.version + '.zip', function (err) {
  if (err) {
    console.log('Zipping extension failed.', err);
  } else {
    console.log('Zipping extension successful.');
  }
});
