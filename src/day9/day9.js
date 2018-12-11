let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));

readFile(inputPath, inputText => {
  const [totalPlayers, lastMarble] = inputText.trim().match(/\d+/g).map(item => +item);

  console.time('Time Task1');
  logResult(task1(totalPlayers, lastMarble), 1);
  console.timeEnd('Time Task1');
  console.log();

  console.time('Time Task2');
  logResult(task1(totalPlayers, lastMarble * 100), 2);
  console.timeEnd('Time Task2');
});

function task1(totalPlayers, lastMarble) {

  const scores = new Array(totalPlayers).fill(0);
  let current = node(0, null, null);
  current.prev = current;
  current.next = current;

  let marble = 1;
  let player = 1;
  let arrayLength = 1;

  while (marble <= lastMarble) {
    if (!isSpecial(marble)) {

      const shift1 = current.next;
      const shift2 = current.next.next;
      const newNode = node(marble, shift1, shift2);

      shift1.next = newNode;
      shift2.prev = newNode;
      current = newNode;

      arrayLength += 1;

    } else {
      let toRemove = current;
      for (let i = 0; i < 7; i++) {
        toRemove = toRemove.prev;
      }

      const removed7Marble = toRemove.value;
      scores[player] += marble + removed7Marble;

      const prev = toRemove.prev;
      prev.next = toRemove.next;
      const next = toRemove.next;
      next.prev = toRemove.prev;
      current = next;
    }

    marble += 1;
    player = (player + 1) % totalPlayers;
  }

  return _.max(scores);
}

function isSpecial(marble) {
  return marble % 23 === 0;
}

function node(value, prev, next) {
  return { value, next, prev }
}

