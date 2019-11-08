let path = require('path');
let _ = require('lodash');

const isTest = false;
let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));


readFile(inputPath, (data) => {
  const normalData = data;

  console.time('Time Task1');
  logResult(task1(normalData), 1);
  console.timeEnd('Time Task1');

  console.time('Time Task2');
  logResult(task2(normalData), 2);
  console.timeEnd('Time Task2');
});

const UP = '^';
const DOWN = 'v';
const LEFT = '<';
const RIGHT = '>';
const DIRECTIONS = [UP, RIGHT, DOWN, LEFT];

const HORIZONTAL = '-';
const VERTICAL = '|';
const EAST = '/';
const WEST = '\\';
const INTERSECTION = '+';
const ROADS = [HORIZONTAL, VERTICAL, EAST, WEST];

function task1(data) {
  const matrix = data.split('\n');
  const X = matrix.length;
  const MAP = initMap(matrix);
  let tickNumber = 0;
  // printMap(MAP);
  debugger

  try {
    while (1) {
      tick(MAP, X, tickNumber);
      // printMap(MAP);
      tickNumber += 1;
      debugger
    }
  } catch (e) {
    const { x, y } = e;
    return `${y},${x} ::Collision at (y,x)`
  }
}

function task2(data) {

}

function initMap(matrix) {
  return matrix.map(row => {
    return row.split('').filter(c => c !== '\r').map(char => {
      if (char === UP || char === DOWN) {
        return {
          road: VERTICAL,
          cart: {
            dir: char,
            nextTurn: -1
          }
        }
      }

      if (char === LEFT || char === RIGHT) {
        return {
          road: HORIZONTAL,
          cart: {
            dir: char,
            nextTurn: -1
          }
        }
      }

      return {
        road: char,
        cart: {}
      }
    })
  });
}

function tick(MAP, X, tickNumber) {
  for (let x = 0; x < X; x++) {
    const Y = MAP[x].length;
    for (let y = 0; y < Y; y++) {
      const current = MAP[x][y];
      if (!current.cart.dir || current.cart.tickNumber === tickNumber) {
        continue;
      }

      // printMap(MAP);
      current.cart.tickNumber = tickNumber;

      if (current.cart.dir === RIGHT) {
        let next = MAP[x][y + 1];
        if (next.cart.dir) {
          throw { x, y: y + 1 };
        }

        handleNextRoad(current, next, { [WEST]: DOWN, [EAST]: UP });
      }

      if (current.cart.dir === LEFT) {
        let next = MAP[x][y - 1];
        if (next.cart.dir) {
          throw { x, y: y - 1 };
        }

        handleNextRoad(current, next, { [WEST]: UP, [EAST]: DOWN });
      }

      if (current.cart.dir === UP) {
        let next = MAP[x - 1][y];
        if (next.cart.dir) {
          throw { x: x - 1, y };
        }

        handleNextRoad(current, next, { [WEST]: LEFT, [EAST]: RIGHT });
      }

      if (current.cart.dir === DOWN) {
        let next = MAP[x + 1][y];
        if (next.cart.dir) {
          throw { x: x + 1, y };
        }

        handleNextRoad(current, next, { [WEST]: RIGHT, [EAST]: LEFT });
      }
    }
  }
}

function handleIntersection({ cart }) {
  const currentDirIndex = DIRECTIONS.indexOf(cart.dir);
  const nextDirIndex = (currentDirIndex + cart.nextTurn + 4) % 4;

  cart.dir = DIRECTIONS[nextDirIndex];
  cart.nextTurn = cart.nextTurn === 1 ? -1 : cart.nextTurn + 1
}


function handleNextRoad(current, next, directions) {
  if (next.road === INTERSECTION) {
    handleIntersection(current);
  } else if (next.road === WEST) {
    current.cart.dir = directions[WEST];
  } else if (next.road === EAST) {
    current.cart.dir = directions[EAST];
  }

  next.cart = current.cart;
  current.cart = {};
}

function printMap(MAP) {
  for (let i = 0; i < MAP.length; i++) {
    console.log(MAP[i].map(({ cart, road }) => cart.dir || road).join(''));
  }
}
