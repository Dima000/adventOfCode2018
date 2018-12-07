let path = require('path');
let inputPath = path.join(__dirname, 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));

readFile(inputPath, (data) => {
  const normalData = data.trim().split('\n').map(item => +item);

  console.time('Time Task1');
  logResult(task1(normalData), 1);
  console.timeEnd('Time Task1');

  console.time('Time Task2');
  logResult(task2(normalData), 2);
  console.timeEnd('Time Task2');
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
