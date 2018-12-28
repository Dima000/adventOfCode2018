//EXPLANATION
// After a certain period the states just repeat.
// Final state can be determined or one can wait

let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));

readFile(inputPath, inputText => {
  const data = inputText
    .trim()
    .replace(/\r\n/g, '$')
    .replace(/\n/g, '$')
    .split('$$');

  console.time('Time Task1');
  logResult(task1(data, 20), 1);
  console.timeEnd('Time Task1');
  console.log();

  console.time('Time Task2');
  logResult(task1(data, 50000000000), 2);
  console.timeEnd('Time Task2');
});

const stateRegex = /[#.]+/;
const rulesRegex = /([#.]+) => ([#.])/;


function task1(data, generations) {
  // Add Rules
  const rulesArray = data[1].split('$');
  const rules = new Set();

  for (let line of rulesArray) {
    const [fullMatch, rule, result] = rulesRegex.exec(line);
    if (result === '#') {
      rules.add(rule);
    }
  }

  // Add state
  const history = new Map();
  let state = data[0].match(stateRegex)[0];
  let startIndex = 0;


  let prevStates = [];
  for (let i = 0; i < generations; i++) {
    let result;
    if (history.has(state)) {
      result = history.get(state);
    } else {
      result = nextLife(state, rules);
      history.set(state, result);
    }

    state = result.state;
    startIndex += result.indexOffset;

    if (i % 49999 === 0) {
      if (prevStates.length === 5 && prevStates.every(i => i === prevStates[0])) {
        break;
      } else if (prevStates.length === 5) {
        prevStates = [];
      } else {
        prevStates.push(state);
      }
    }
  }

  let count = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] === '#') {
      count += i + startIndex;
    }
  }

  return count;
}

function nextLife(prevState, rules) {
  const state = '....' + prevState + '....';
  const newState = [];

  for (let i = 2; i < state.length - 2; i++) {
    const rule = state.substr(i - 2, 5);
    const newValue = rules.has(rule) ? '#' : '.';
    newState.push(newValue);
  }

  let i = 0;
  while (true) {
    if (newState[i] === '#') {
      break;
    }

    newState[i] = '';
    i += 1;
  }

  let j = newState.length - 1;
  while (true) {
    if (newState[j] === '#') {
      break;
    }

    newState[j] = '';
    j -= 1;
  }

  return {
    state: newState.join(''),
    indexOffset: i - 2
  };
}
