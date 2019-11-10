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
  const { MAP } = initMap(matrix);
  let tickNumber = 0;

  try {
    while (1) {
      tick(MAP, X, tickNumber);
      tickNumber += 1;
    }
  } catch (e) {
    const { x, y } = e;
    return `${y},${x} ::Collision at (y,x)`
  }
}

function task2(data) {
  const matrix = data.split('\n');
  const X = matrix.length;
  let { MAP, cartNumber } = initMap(matrix);
  let tickNumber = 0;

  while (1) {
    const crashes = tick(MAP, X, tickNumber, true);
    tickNumber += 1;
    cartNumber -= crashes.number;

    if (cartNumber === 1) {
      break;
    }
  }

  for (let x = 0; x < X; x++) {
    const y = _.findIndex(MAP[x], item => item.cart.dir);
    if (y >= 0) {
      return `${y},${x} ::Cart at (y,x)`
    }
  }

}

function initMap(matrix) {
  let cartNumber = 0;
  let MAP = matrix.map(row => {
    return row.split('').filter(c => c !== '\r').map(char => {
      if (char === UP || char === DOWN) {
        cartNumber++;
        return {
          road: VERTICAL,
          cart: {
            dir: char,
            nextTurn: -1
          }
        }
      }

      if (char === LEFT || char === RIGHT) {
        cartNumber++;
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

  return { MAP, cartNumber }
}

function tick(MAP, X, tickNumber, modeTask2) {
  let crashes = { number: 0 };

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

        handleCrash(current, next, x, y + 1, modeTask2, crashes);
        handleNextRoad(current, next, { [WEST]: DOWN, [EAST]: UP });
      }

      if (current.cart.dir === LEFT) {
        let next = MAP[x][y - 1];

        handleCrash(current, next, x, y - 1, modeTask2, crashes);
        handleNextRoad(current, next, { [WEST]: UP, [EAST]: DOWN });
      }

      if (current.cart.dir === UP) {
        let next = MAP[x - 1][y];

        handleCrash(current, next, x - 1, y, modeTask2, crashes);
        handleNextRoad(current, next, { [WEST]: LEFT, [EAST]: RIGHT });
      }

      if (current.cart.dir === DOWN) {
        let next = MAP[x + 1][y];

        handleCrash(current, next, x + 1, y, modeTask2, crashes);
        handleNextRoad(current, next, { [WEST]: RIGHT, [EAST]: LEFT });
      }
    }
  }

  return crashes;
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

function handleCrash(current, next, x, y, modeTask2, crashes) {
  if (next.cart.dir && modeTask2) {
    current.cart = {};
    next.cart = {};
    crashes.number += 2;
  } else if (next.cart.dir) {
    throw { x, y };
  }
}

function printMap(MAP) {
  for (let i = 0; i < MAP.length; i++) {
    console.log(MAP[i].map(({ cart, road }) => cart.dir || road).join(''));
  }
}
