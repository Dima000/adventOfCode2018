let path = require('path');
let _ = require('lodash');
const isTest = true;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));

readFile(inputPath, (data) => {
  console.log('First Task: ' + task1(data));
  console.log('Second Task: ' + task2(data));
});


function task1(data) {

}

function task2(data) {

}
