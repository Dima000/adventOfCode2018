let path = require('path');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { matrixOfChars } = require(path.join(__dirname, '..', '..', 'utils', 'matrix.js'));

readFile(inputPath, (data) => {
  const parsedData = data.trim().split('\n');

  console.time('Time Task1');
  console.log('First Task Result: ' + task1(parsedData));
  console.timeEnd('Time Task1');

  console.time('Time Task2');
  console.log('Second Task: ' + task2(parsedData));
  console.timeEnd('Time Task2');
});

const numRegex = /(\d+), (\d+)/;

function task1(data) {
  const { matrix, coordinates, maxY, maxX } = prepareData(data);

  for (let i = 0; i <= maxY; i++) {
    for (let j = 0; j <= maxX; j++) {
      let min = Number.MAX_SAFE_INTEGER;
      let secondMin = Number.MAX_SAFE_INTEGER;
      let minPoint = null;

      for (let k = 0; k < coordinates.length; k++) {
        const dist = findManhattanDistance(j, i, coordinates[k].x, coordinates[k].y);
        if (dist <= min) {
          secondMin = min;
          min = dist;
          minPoint = k;
        }
      }

      matrix[i][j] = min === secondMin ? '.' : minPoint;
    }
  }

  const infinitePoints = new Set();
  for (let y = 0; y < maxY + 1; y++) {
    infinitePoints.add(matrix[y][0]);
    infinitePoints.add(matrix[y][maxX])
  }
  for (let x = 0; x < maxX + 1; x++) {
    infinitePoints.add(matrix[0][x]);
    infinitePoints.add(matrix[maxY][x]);
  }

  let maxTimes = 0;
  for (let i = 0; i < coordinates.length; i++) {
    if (!infinitePoints.has(i)) {
      const times = findTimes(matrix, i);
      maxTimes = Math.max(maxTimes, times);
    }
  }

  return maxTimes;
}

function task2(data) {
  const { coordinates, maxY, maxX } = prepareData(data);
  const allowedLength = isTest ? 32 : 10000;

  let maxArea = 0;

  for (let i = 0; i <= maxY; i++) {
    for (let j = 0; j <= maxX; j++) {
      let totalDistance = 0;

      for (let k = 0; k < coordinates.length; k++) {
        totalDistance += findManhattanDistance(j, i, coordinates[k].x, coordinates[k].y);
      }

      maxArea += totalDistance < allowedLength ? 1 : 0;
    }
  }

  return maxArea;
}

function prepareData(data) {
  const coordinates = [];
  let maxX = 0;
  let maxY = 0;

  for (let i = 0; i < data.length; i++) {
    const match = numRegex.exec(data[i]);
    const x = +match[1];
    const y = +match[2];

    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);

    coordinates.push({ x, y });
  }

  const matrix = matrixOfChars(maxX + 1, maxY + 1, '-');

  return {
    coordinates,
    matrix,
    maxX,
    maxY
  }
}

function findManhattanDistance(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findTimes(matrix, id) {
  let times = 0;

  matrix.forEach(row => {
    row.forEach(item => {
      if (item === id) {
        times += 1;
      }
    })
  });

  return times;
}
