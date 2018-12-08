let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));

readFile(inputPath, inputText => {
  const data = inputText.trim().split(' ').map(i => +i);

  console.time('Time Task1');
  logResult(task1(data), 1);
  console.timeEnd('Time Task1');
  console.log();

  console.time('Time Task2');
  logResult(task2(data), 2);
  console.timeEnd('Time Task2');
});


function task1(data) {
  const nodes = generateNode(0, data);

  return metadataSum(nodes.node);
}

function task2(data) {
  const nodes = generateNode(0, data);

  return rootValue(nodes.node);
}


function generateNode(pos, data) {
  const children = new Array(data[pos]);
  const metadata = [];
  const metadataLength = data[pos + 1];
  let nextPos = pos + 2;

  for (let i = 0; i < children.length; i++) {
    const next = generateNode(nextPos, data);

    children[i] = next.node;
    nextPos = next.length;
  }

  for (let j = nextPos; j < nextPos + metadataLength; j++) {
    metadata.push(data[j]);
  }

  return {
    node: {
      children,
      metadata
    },
    length: nextPos + metadataLength
  };
}

function metadataSum(node) {
  let sum = _.sum(node.metadata);

  if (node.children) {
    for (let child of node.children) {
      sum += metadataSum(child);
    }
  }

  return sum;
}

function rootValue(node) {
  if (node.children.length === 0) {
    return _.sum(node.metadata);
  }

  let value = 0;
  for (let m of node.metadata) {
    const childNode = node.children[m - 1];
    if (childNode) {
      value += rootValue(childNode);
    }
  }

  return value;
}
