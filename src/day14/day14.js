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
  const arrayRecipes = [3, 7];
  let worker1 = 0;
  let worker2 = 1;
  let counter = 0;

  while (1) {
    let sum = arrayRecipes[worker1] + arrayRecipes[worker2];

    //add new recipes
    if (sum > 9) {
      arrayRecipes.push(1);
      arrayRecipes.push(sum % 10);
    } else {
      arrayRecipes.push(sum);
    }

    //replace workerIndexes
    worker1 = (worker1 + arrayRecipes[worker1] + 1) % arrayRecipes.length;
    worker2 = (worker2 + arrayRecipes[worker2] + 1) % arrayRecipes.length;

    const lastSequence = arrayRecipes.slice(arrayRecipes.length - inputSequence.length, arrayRecipes.length);
    if (_.isEqual(lastSequence, inputSequence)) {
      break;
    }

    counter++;
  }

  return arrayRecipes.length - inputSequence.length;
}
