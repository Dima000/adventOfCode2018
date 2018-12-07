let path = require('path');
let _ = require('lodash');
const isTest = false;
const WORKERS = isTest ? 2 : 5;
const DELAY = isTest ? 0 : 60;

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
  const { graphMap, staging, end } = processData(data);

  const result = [];
  let prev = _.min(staging);

  while (true) {
    if (graphMap.get(prev)) {
      for (let candidate of graphMap.get(prev).children) {
        if (!_.includes(result, candidate) && isValidForStaging(graphMap.get(candidate), result)) {
          staging.push(candidate)
        }
      }
    }

    if (_.includes(staging, end)) {
      result.push(end);
      break;
    }

    const next = _.min(staging);
    result.push(next);
    _.remove(staging, item => item === next);
    prev = next;
  }

  return result.join('');
}

function task2(data) {
  const { graphMap, staging, end } = processData(data);

  let counter = 0;
  const workers = new Array(WORKERS);
  const result = [];

  while (true) {
    // Assign workers to tasks
    for (let i = 0; i < workers.length; i++) {
      if (!workers[i] && staging.length > 0) {
        const next = _.min(staging);
        _.remove(staging, item => item === next);

        workers[i] = {
          task: next,
          time: getNodeTime(next)
        }
      }
    }

    // workers[0] && console.log('worker1:', workers[0].task, workers[0].time);
    // workers[1] && console.log('worker2:', workers[1].task, workers[1].time);

    // Spend time working
    for (let w of workers) {
      if (w) {
        w.time -= 1;
      }
    }

    // Remove completed jobs and clear worker
    // Add results
    // Gather stating candidates
    let candidatesStaging = [];
    for (let i = 0; i < workers.length; i++) {
      const w = workers[i];
      if (w && w.time === 0) {
        const nodeId = w.task;
        result.push(nodeId);

        const children = graphMap.get(nodeId).children;
        if (children) {
          candidatesStaging = candidatesStaging.concat(Array.from(children));
        }

        workers[i] = null;
      }
    }

    //Add to Staging from candidates
    for (let candidate of candidatesStaging) {
      if (!_.includes(result, candidate) && isValidForStaging(graphMap.get(candidate), result)) {
        staging.push(candidate);
      }
    }

    if (_.includes(result, end)) {
      counter += 1;
      break;
    }

    // console.log('--WORK--');
    // workers[0] && console.log('worker1:', workers[0].task);
    // workers[1] && console.log('worker2:', workers[1].task);
    // console.log('result:', result);
    // console.log('staging', staging);
    // console.log();
    // console.log();

    counter += 1;
  }

  return counter;
}


function processData(data) {
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

  let end = null;
  let staging = [];
  for (let [key, value] of graphMap.entries()) {
    if (!value.parents) {
      staging.push(key);
    }
    if (!value.children) {
      end = key;
    }
  }

  return {
    graphMap,
    end,
    staging
  };
}

function isValidForStaging(node, completedNodes) {
  for (let parent of node.parents) {
    if (!_.includes(completedNodes, parent)) {
      return false;
    }
  }

  return true;
}

function getNodeTime(nodeId) {
  //65 ASCII code for A
  return DELAY + nodeId.charCodeAt(0) + 1 - 65;
}
