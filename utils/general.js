// Console color info
// https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
function logResult(result, taskNr) {
  const name = taskNr === 1 ? 'First' : 'Second';
  console.warn(`${name} Task Result:\x1b[36m`, result, '\x1b[0m');
}

module.exports.logResult = logResult;
