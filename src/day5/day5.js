let path = require('path');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { allLetters } = require(path.join(__dirname, '..', '..', 'utils', 'strings.js'));

readFile(inputPath, (data) => {
  const dataArray = data.trim().split('');

  console.time('Time Task1');
  console.log('First Task Result: ' + task1(dataArray).length);
  console.timeEnd('Time Task1');

  console.time('Time Task2');
  console.log('Second Task: ' + task2(dataArray));
  console.timeEnd('Time Task2');
});


function task1(originalData) {
  let finished = false;
  let data = [...originalData];

  while (!finished) {
    const { array, isChanged } = removePairs(data);
    data = array;
    finished = !isChanged;
  }

  return data;
}

function task2(data) {
  let min = Number.MAX_SAFE_INTEGER;

  for (let i of allLetters) {
    const strippedData = stripData(data, i);
    const parsedData = task1(strippedData);
    min = Math.min(parsedData.length, min)
  }

  return min;
}


function isPair(a, b) {
  const A = a.toUpperCase();
  const B = b.toUpperCase();

  return A === B && a !== b;
}

function removePairs(data) {
  let isChanged = false;

  for (let i = 0; i < data.length - 1; i++) {
    if (data[i] && isPair(data[i], data[i + 1])) {
      data[i] = 0;
      data[i + 1] = 0;
      isChanged = true;
    }
  }

  return {
    array: data.filter(item => !!item),
    isChanged
  };
}

function stripData(data, letter) {
  return data.filter(item => item !== letter.toUpperCase() && item !== letter.toLowerCase())
}
