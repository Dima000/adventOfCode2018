/* SHOULD BE RUN IN TERMINAL WITH HORIZONTAL SCROLL */
let path = require('path');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));
let { matrixOfChars, prettyPrintMatrix } = require(path.join(__dirname, '..', '..', 'utils', 'matrix.js'));

readFile(inputPath, inputText => {
  const data = inputText.trim().split('\n');

  console.time('Time Task 1-2');
  logResult(task1(data), 1);
  console.timeEnd('Time Task 1-2');
});

const regex = /<([ \d-]+), ([ \d-]+)>.*<([ \d-]+), ([ \d-]+)>/;

function task1(data) {
  const points = [];

  //Find and store all points
  for (let line of data) {
    const match = regex.exec(line).map(i => +i);
    const [fullMatch, posX, posY, veloX, veloY] = match;

    points.push({
      position: { x: posX, y: posY },
      velocity: { x: veloX, y: veloY }
    });
  }


  let area = {
    value: Number.MAX_SAFE_INTEGER,
    maxX: null,
    maxY: null
  };

  let timer = 0;
  while (true) {
    movePoints(points);
    const newArea = spreadArea(points);

    // The points will converge up to the state when they form the letters
    // Afterwards they diverge so the area starts to increase again
    if (newArea.value > area.value) {
      movePointsBack(points);
      break;
    }

    area = newArea;
    timer += 1;
  }

  printMap(points, area.maxX + 1, area.maxY + 1);

  return timer;
}

function printMap(points, maxX, maxY) {
  const matrix = matrixOfChars(maxX, maxY, '.');

  for (let p of points) {
    const { x, y } = p.position;
    if (x >= 0 && x < maxX && y >= 0 && y < maxY) {
      matrix[y][x] = '#';
    }
  }

  prettyPrintMatrix(matrix);
}

function movePoints(points) {
  for (let p of points) {
    const { x, y } = p.velocity;
    p.position.x += x;
    p.position.y += y
  }
}

function movePointsBack(points) {
  for (let p of points) {
    const { x, y } = p.velocity;
    p.position.x -= x;
    p.position.y -= y
  }
}

// 'spreadArea' finds the area that bounds the furthest input points
function spreadArea(points) {
  let minX;
  let minY;
  let maxX = 0;
  let maxY = 0;

  for (let p of points) {
    const { x, y } = p.position;
    minX = Math.min(x, maxX);
    minY = Math.min(y, maxY);

    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
  }

  return {
    value: (Math.abs(minX) + maxX) * (Math.abs(minY) + maxY),
    maxX: maxX,
    maxY: maxY
  }
}
