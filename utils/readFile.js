let fs = require('fs');

function readFile(filePath, successCallback) {
  return fs.readFile(filePath, 'utf8', function (err, data) {
    if (err) {
      console.log(err)
    }

    successCallback(data)
  })
}

module.exports = readFile;
