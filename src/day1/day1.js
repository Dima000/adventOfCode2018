let path = require('path');
let inputPath = path.join(__dirname, 'input.txt');
let readFile = require(path.join(__dirname, '/../../utils/readFile.js'));

readFile(inputPath, (data) => {
  console.log('First Task: ' + task1(data));
  console.log('Second Task: ' + task2(data));
});


function task1(data) {
  const normaData = data.trim().split('\r\n').map(item => +item);
  let counter = 0;

  for (let num of normaData) {
    counter += +num;
  }

  return counter;
}

function task2(data) {
  const normaData = data.trim().split('\r\n').map(item => +item);
  let counter = 0;
  let results = new Set();

  while (true) {
    for (let num of normaData) {
      counter += num;

      if (results.has(counter)) {
        return counter;
      } else {
        results.add(counter);
      }
    }
  }
}
