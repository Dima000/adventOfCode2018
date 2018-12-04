let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { matrixOfZeros } = require(path.join(__dirname, '..', '..', 'utils', 'matrix.js'));

readFile(inputPath, (data) => {
  const lines = data.trim().split('\r\n');

  console.log('First Task: ' + task1(lines));
  console.log('Second Task: ' + task2(lines));
});


const regex = new RegExp(/(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);

function task1(data) {
  let { maxWidth, maxHeight, matrix } = processData(data);

  let overlaps = 0;
  for (let i = 0; i < maxWidth; i++) {
    for (let k = 0; k < maxHeight; k++) {
      if (matrix[i][k] > 1) {
        overlaps += 1;
      }
    }
  }

  return overlaps;
}

function task2(data) {
  let { dataMap, matrix } = processData(data);

  for (let rect of dataMap.values()) {
    let isValid = true;
    for (let i = rect.leftOffset; i < rect.leftOffset + rect.width; i++) {
      for (let k = rect.topOffset; k < rect.topOffset + rect.height; k++) {
        isValid = isValid && matrix[i][k] === 1;
      }
    }

    if(isValid) {
      return rect.id
    }
  }
}


function processData(data) {
  const dataMap = new Map();
  let maxWidth = 0;
  let maxHeight = 0;

  for (let item of data) {
    const match = regex.exec(item);

    const id = +match[1];
    const rectangle = {
      id,
      leftOffset: +match[2],
      topOffset: +match[3],
      width: +match[4],
      height: +match[5]
    };

    dataMap.set(id, rectangle);
    if (maxHeight < rectangle.topOffset + rectangle.height) {
      maxHeight = rectangle.topOffset + rectangle.height;
    }
    if (maxWidth < rectangle.leftOffset + rectangle.width) {
      maxWidth = rectangle.leftOffset + rectangle.width;
    }
  }


  const matrix = matrixOfZeros(maxWidth, maxHeight);

  for (let rect of dataMap.values()) {
    for (let i = rect.leftOffset; i < rect.leftOffset + rect.width; i++) {
      for (let k = rect.topOffset; k < rect.topOffset + rect.height; k++) {
        matrix[i][k] += 1;
      }
    }
  }

  return {
    dataMap,
    maxHeight,
    maxWidth,
    matrix
  };
}
