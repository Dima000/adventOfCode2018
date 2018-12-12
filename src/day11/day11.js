let path = require('path');
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));

const inputNr = 5034;

console.time('Time Task1');
logResult(task1(inputNr), 1);
console.timeEnd('Time Task1');
console.log();

console.time('Time Task2');
logResult(task2(inputNr), 2);
console.timeEnd('Time Task2');


// ------ START HERE : task1 -------
function task1(inputNr) {
  const matrix = prepareData(inputNr);
  let maxPower = 0;
  let coordinates = [];

  for (let y = 0; y < 300 - 3; y++) {
    for (let x = 0; x < 300 - 3; x++) {
      const gridPower = computeGridPower(x, y, matrix, 3);
      if (gridPower > maxPower) {
        maxPower = gridPower;
        coordinates = [x + 1, y + 1];
      }
    }
  }

  return coordinates.join(',')
}

// ------ START HERE : task2 -------
// ----- Brace yourselves, iterations are coming -------
function task2(inputNr) {
  const matrix = prepareData(inputNr);
  let maxPower = 0;
  let coordinates = [];

  for (let size = 1; size <= 300; size++) {
    for (let y = 0; y < 300 - size; y++) {
      for (let x = 0; x < 300 - size; x++) {
        const gridPower = computeGridPower(x, y, matrix, size);
        if (gridPower > maxPower) {
          maxPower = gridPower;
          coordinates = [x + 1, y + 1, size];
        }
      }
    }

    if (size % 10 === 0) {
      console.log('Size finished:', size);
    }
  }

  return coordinates.join(',');
}

function computePowerLevel(x, y, serialNr) {
  const rackId = x + 10;
  let powerLevel = rackId * y + serialNr;

  powerLevel *= rackId;
  powerLevel = Math.trunc((powerLevel % 1000) / 100);
  powerLevel -= 5;

  return powerLevel
}

function computeGridPower(x, y, matrix, size) {
  let sum = 0;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      sum += matrix[y + i][x + j];
    }
  }

  return sum;
}

function prepareData(inputNr) {
  const matrix = [];

  for (let y = 0; y < 300; y++) {
    matrix.push(new Array(300));

    for (let x = 0; x < 300; x++) {
      matrix[y][x] = computePowerLevel(x + 1, y + 1, inputNr);
    }
  }

  return matrix;
}

module.exports.computePowerLevel = computePowerLevel;
