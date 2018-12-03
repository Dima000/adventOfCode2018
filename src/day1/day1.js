let path = require('path');
let inputPath = path.join(__dirname, 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));

readFile(inputPath, (data) => {
  const normalData = data.trim().split('\r\n').map(item => +item);

  console.log('First Task: ' + task1(normalData));
  console.log('Second Task: ' + task2(normalData));
});


function task1(data) {
  let counter = 0;

  for (let num of data) {
    counter += +num;
  }

  return counter;
}

function task2(data) {
  let counter = 0;
  let results = new Set();

  while (true) {
    for (let num of data) {
      counter += num;

      if (results.has(counter)) {
        return counter;
      } else {
        results.add(counter);
      }
    }
  }
}
