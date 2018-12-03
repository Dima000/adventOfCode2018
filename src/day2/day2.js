let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '/../../utils/readFile.js'));

readFile(inputPath, (data) => {
  console.log('First Task: ' + task1(data));
  console.log('Second Task: ' + task2(data));
});


function task1(data) {
  const normaData = data.trim().split('\r\n');

  let boxMap;
  let twoLetters = 0;
  let threeLetters = 0;

  for (let id of normaData) {
    boxMap = new Map();

    for (let c of id) {
      if (boxMap.has(c)) {
        boxMap.set(c, boxMap.get(c) + 1)
      } else {
        boxMap.set(c, 1)
      }
    }


    const array = Array.from(boxMap.values());

    if (_.includes(array, 2)) {
      twoLetters += 1;
    }
    if (_.includes(array, 3)) {
      threeLetters += 1;
    }
  }

  return threeLetters * twoLetters;
}

function task2(data) {
  const normaData = data.trim().split('\r\n');

  for (let i = 0; i < normaData.length - 1; i++) {
    for (let j = i + 1; j < normaData.length; j++) {
      const index = isSameStr(normaData[i], normaData[j]);

      if (typeof index === 'number') {
        return getResultString(normaData[i], index);
      }
    }
  }
}

function isSameStr(str1, str2) {
  let errors = 0;
  let indexError = null;

  for (let i = 0; i < str1.length; i++) {
    if (str1[i] !== str2[i]) {
      errors += 1;
      indexError = i;
    }
    if (errors > 1) {
      return null;
    }
  }

  return errors === 1 ? indexError : null;
}

function getResultString(str, index) {
  const array = str.split('');
  array[index] = '';

  return array.join('');
}
