var zipFolder = require('zip-folder');
var manifest = require(__dirname + '/../lib/manifest.json');

zipFolder(__dirname + '/../lib', __dirname + '/../build/kuker_' + manifest.version + '.zip', function (err) {
  if (err) {
    console.log('Zipping extension failed.', err);
  } else {
    console.log('Zipping extension successful.');
  }
});
