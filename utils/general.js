// Console color info
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function logResult(result, taskNr) {
  const name = taskNr === 1 ? 'First' : 'Second';
  console.log(`${name} Task Result:\x1b[36m`, result, '\x1b[0m');
}

function charCount(str, char = '#') {
  const match = str.match(new RegExp(char, 'g'));
  return match ? match.length : 0;
}

module.exports.logResult = logResult;
