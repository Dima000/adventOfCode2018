let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { matrixOfZeros } = require(path.join(__dirname, '..', '..', 'utils', 'matrix.js'));

readFile(inputPath, (data) => {
  const parsedData = data.trim().split('\n');

  console.time('Time Task1');
  console.log('First Task Result: ' + task1(parsedData));
  console.timeEnd('Time Task1');

  console.time('Time Task2');
  console.log('Second Task: ' + task2(parsedData));
  console.timeEnd('Time Task2');
});

const lettersRegex = /Step ([A-Z]) .+ step ([A-Z])/;

function task1(data) {
  const graphMap = new Map();

  for (let line of data) {
    const [match, parentNode, childNode] = lettersRegex.exec(line);

    const parentData = graphMap.get(parentNode) || {};
    const childData = graphMap.get(childNode) || {};

    if (!parentData.children) {
      parentData.children = new Set();
    }
    if (!childData.parents) {
      childData.parents = new Set();
    }

    parentData.children.add(childNode);
    childData.parents.add(parentNode);

    graphMap.set(parentNode, parentData);
    graphMap.set(childNode, childData);
  }

  let start = 'Z';
  let end = null;
  for (let [key, value] of graphMap.entries()) {
    if (!value.parents) {
      start = _.min([start, key]);
    }
    if (!value.children) {
      end = key;
    }
  }

  const result = [start];
  let staging = [...graphMap.get(start).children];

  while (true) {
    if (_.includes(staging, end)) {
      result.push(end);
      break;
    }
    console.log('result', result);
    console.log('staging', staging);

    const next = _.min(staging);
    result.push(next);
    _.remove(staging, item => item === next);

    if(graphMap.has(next)) {
      for (let candidate of graphMap.get(next).children) {

        if (isValidForStaging(candidate, graphMap.get(candidate), result)) {
          staging.push(candidate)
        }
      }

      console.log('next', next);
      console.log('final staging', staging);
      console.log('final result', result);
      console.log();
    }

    debugger
  }


  return result.join('');
}

function task2(data) {

}

function isValidForStaging(candidate, node, completedNodes) {
  if (candidate === 'B') {
    debugger
  }
  for (let parent of node.parents) {
    if (!_.includes(completedNodes, parent)) {
      return false;
    }
  }

  return true;
}
