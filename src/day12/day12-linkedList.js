/* VERY SLOW */

let path = require('path');
let _ = require('lodash');
const isTest = true;



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
  logResult(task1(data, 1), 1);
  console.timeEnd('Time Task1');
  console.log();

  console.time('Time Task2');
  // logResult(task1(data, 50000000000), 2);
  console.timeEnd('Time Task2');
});

const stateRegex = /[#.]+/;
const rulesRegex = /([#.]+) => ([#.])/;


function task1(data, generations) {
  //Populate Rules
  const rulesArray = data[1].split('$');
  const rules = new Set();

  for (let line of rulesArray) {
    const [fullMatch, rule, result] = rulesRegex.exec(line);
    if (result === '#') {
      rules.add(rule);
    }
  }

  // Create stash with nodes
  const state = data[0].match(stateRegex)[0];
  let start = createNode(state[0] === '#', 0, null, null);
  let end = null;
  let prev = start;

  for (let i = 1; i < state.length; i++) {
    const node = createNode(state[i] === '#', i, prev, null);
    prev.next = node;
    prev = node;

    if (i === state.length - 1) {
      end = node
    }
  }
  printList(0, start);

  //State iterations
  for (let i = 0; i < generations; i++) {
    const result = nextLife(start, end, rules);

    start = result.start;
    end = result.end;

    printList(i + 1, start);
    if (i % 10000 === 0) {
      console.log('Done:', (i / generations * 100).toFixed(3));
    }
  }

  //Compute count
  let indexCount = 0;
  while (start) {
    indexCount += start.state ? start.index : 0;
    start = start.next;
  }

  return indexCount;
}

function nextLife(startNode, endNode, rules) {
  const prev1 = createNode(false, startNode.index - 1, null, startNode);
  const prev2 = createNode(false, startNode.index - 2, null, prev1);
  startNode.prev = prev1;
  prev1.prev = prev2;

  const next1 = createNode(false, endNode.index + 1, endNode, null);
  const next2 = createNode(false, endNode.index + 2, next1, null);
  endNode.next = next1;
  next1.next = next2;

  let start = prev2;
  let result = _.cloneDeep(prev2);

  while (start) {
    const values = [];
    const hasPrev1 = start.prev;
    const hasPrev2 = hasPrev1 && start.prev.prev;
    const hasNext = start.next;
    const hasNext2 = hasNext && start.next.next;

    values[0] = hasPrev2 && start.prev.prev.state ? '#' : '.';
    values[1] = hasPrev1 && start.prev.state ? '#' : '.';
    values[2] = start.state ? '#' : '.';
    values[3] = hasNext && start.next.state ? '#' : '.';
    values[4] = hasNext2 && start.next.next.state ? '#' : '.';

    const rule = values.join('');

    result.state = rules.has(rule);
    if (start.next) {
      result = result.next
    }

    start = start.next;
  }

  let resultStart = result;
  while (resultStart.prev !== null) {
    resultStart = resultStart.prev;
  }

  return trimList(resultStart, result);
}

function createNode(state, index, prev, next) {
  return {
    state,
    index,
    prev,
    next
  };
}

function printList(step, nodeStart) {
  let node = nodeStart;
  const values = [];

  while (node) {
    values.push(node.state ? '#' : '.');
    node = node.next;
  }

  console.log('\t' + step, values.join(''));
}

function trimList(start, end) {
  while (true) {
    if (start.state) {
      break;
    }

    start = start.next;
    start.prev = null;
  }

  while (true) {
    if (end.state) {
      break;
    }

    end = end.prev;
    end.next = null;
  }

  return { start, end };
}
