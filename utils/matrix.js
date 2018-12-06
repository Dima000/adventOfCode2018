let math = require('mathjs');

function matrixOfZeros(width, height) {
  return math.zeros(width, height).toArray();
}

function matrixOfChars(width, height, char) {
  const matrix = [];

  for (let i = 0; i < height; i++) {
    matrix.push(new Array(width).fill(char))
  }

  return matrix;
}

function prettyPrintMatrix(matrix) {
  for(let i=0; i< matrix.length; i++) {
    console.log(matrix[i].join(' '));
  }
}

function printSet(set) {
  return Array.from(set.values()).join(' ');
}

module.exports.matrixOfZeros = matrixOfZeros;
module.exports.matrixOfChars = matrixOfChars;
module.exports.prettyPrintMatrix = prettyPrintMatrix;
