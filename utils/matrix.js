let math = require('mathjs');

function matrixOfZeros(width, height) {
  return math.zeros(width, height).toArray();
}

module.exports.matrixOfZeros = matrixOfZeros;
