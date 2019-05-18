let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { logResult, digitArray } = require(path.join(__dirname, '..', '..', 'utils', 'general.js'));

readFile(inputPath, inputText => {
  const data = +inputText;

  console.time('Time Task1');
  logResult(task1(data), 1);
  console.timeEnd('Time Task1');
  console.log();

  console.time('Time Task2');
  logResult(task2(data), 2);
  console.timeEnd('Time Task2');
});

function task1(maxNumberOfRecipes) {
  const arrayRecipes = [3, 7];
  let worker1 = 0;
  let worker2 = 1;

  while (arrayRecipes.length < +maxNumberOfRecipes + 10) {
    let sum = arrayRecipes[worker1] + arrayRecipes[worker2];
    // console.log(sum);

    //add new recipes
    if (sum > 9) {
      const digit0 = sum % 10;
      const digit1 = 1;
      arrayRecipes.push(digit1);
      arrayRecipes.push(digit0);
    } else {
      arrayRecipes.push(sum);
    }

    //replace workerIndexes
    worker1 = (worker1 + arrayRecipes[worker1] + 1) % arrayRecipes.length;
    worker2 = (worker2 + arrayRecipes[worker2] + 1) % arrayRecipes.length;
    if (worker1 < 100 && worker2 < 100) {
      // console.log(worker1, worker2);
    }
  }

  return arrayRecipes.slice(arrayRecipes.length - 10, arrayRecipes.length).join('');
}

function task2(inputNumber) {
  const CHUNK_MAX = 1000;
  const inputSequence = _.reverse(digitArray(inputNumber));
  const arrayRecipes = [[3, 7]];
  let chunk = 0;
  let worker1 = 0;
  let worker2 = 1;
  let counter = 0;

  while (1) {
    const val1 = getValue(arrayRecipes, worker1, CHUNK_MAX);
    const val2 = getValue(arrayRecipes, worker2, CHUNK_MAX);
    let sum = val1 + val2;

    //add new recipes
    if (sum > 9) {
      arrayRecipes[chunk].push(1);
      arrayRecipes[chunk].push(sum % 10);
    } else {
      arrayRecipes[chunk].push(sum);
    }

    const totalLength = totalLenght(arrayRecipes, chunk, CHUNK_MAX);
    //replace workerIndexes
    const worker1Aux = (worker1 + getValue(arrayRecipes, worker1, CHUNK_MAX) + 1) % totalLength;
    const worker2Aux = (worker2 + getValue(arrayRecipes, worker2, CHUNK_MAX) + 1) % totalLength;

    if (isNaN(worker1Aux) || isNaN(worker2Aux)) {
      debugger
    }

    worker1 = worker1Aux;
    worker2 = worker2Aux;


    const lastSequence = arrayRecipes[chunk].slice(arrayRecipes[chunk].length - inputSequence.length, arrayRecipes[chunk].length);
    if (_.isEqual(lastSequence, inputSequence)) {
      break;
    }
    if (counter % CHUNK_MAX === 0) {
      // console.log(arrayRecipes.length);
      // console.log(worker1, worker2);
    }

    if (arrayRecipes[chunk].length >= CHUNK_MAX) {
      const extra = arrayRecipes[chunk].slice(CHUNK_MAX + 1, arrayRecipes[chunk].length);
      arrayRecipes.push(extra);
      chunk++;
    }

    counter++;
  }

  const totalLength = totalLenght(arrayRecipes, chunk, CHUNK_MAX);
  return totalLength - inputSequence.length;
}

function getValue(array, workerIndex, chunksMax) {
  const chunk = Math.floor(workerIndex / chunksMax);
  const index = workerIndex % chunksMax;

  return array[chunk][index];
}

function totalLenght(arrayRecipes, chunk, chunkMax) {
  return (arrayRecipes.length - 1) * chunkMax + arrayRecipes[chunk].length;
}
