let path = require('path');
let _ = require('lodash');
const isTest = false;

let inputPath = path.join(__dirname, isTest ? 'input.test.txt' : 'input.txt');
let readFile = require(path.join(__dirname, '..', '..', 'utils', 'readFile.js'));
let { matrixOfZeros } = require(path.join(__dirname, '..', '..', 'utils', 'matrix.js'));

readFile(inputPath, (data) => {
  const lines = data.trim().split('\n');

  console.log('First Task: ' + task1(lines));
  console.log('Second Task: ' + task2(lines));
});


const timestampRegex = /(\d{4}-\d\d-\d\d \d\d:\d\d)] (.+)/;
const guardRegex = /\d+/;
const minuteRegex = /:(\d\d)/;

function task1(data) {
  const guardsSleepMap = processData(data);

  let guard = null;
  let maxAsleep = 0;
  for (let [guardId, sleepArray] of guardsSleepMap.entries()) {
    const asleep = _.sum(sleepArray);

    if (asleep > maxAsleep) {
      maxAsleep = asleep;
      guard = guardId
    }
  }

  const maxMinutes = _.max(guardsSleepMap.get(guard));
  const maxMinutesIndex = _.indexOf(guardsSleepMap.get(guard), maxMinutes);

  return guard * maxMinutesIndex;
}

function task2(data) {
  const guardsSleepMap = processData(data);

  let guardId = null;
  let minuteIndex = null;
  let mostAsleep = 0;

  for (let i = 0; i < 60; i++) {
    let guardIdPerMin = null;
    let mostAsleepPerMin = 0;

    for (let [guardId, sleepArray] of guardsSleepMap.entries()) {
      const guardSleepsPerMin = sleepArray[i];
      if (guardSleepsPerMin > mostAsleepPerMin) {
        mostAsleepPerMin = guardSleepsPerMin;
        guardIdPerMin = guardId
      }
    }

    if (mostAsleepPerMin > mostAsleep) {
      mostAsleep = mostAsleepPerMin;
      guardId = guardIdPerMin;
      minuteIndex = i;
    }
  }

  return guardId * minuteIndex;
}

function getMinute(timeStr) {
  return +minuteRegex.exec(timeStr)[1];
}

function processData(data) {
  let times = [];

  for (let item of data) {
    const match = timestampRegex.exec(item);
    times.push({
      time: match[1],
      text: match[2]
    })
  }
  times = _.sortBy(times, 'time');

  let guardId = null;
  let startSleepMin = null;
  const guardsSleepMap = new Map();

  for (let { text, time } of times) {
    const matchGuard = guardRegex.exec(text);
    const newGuardId = matchGuard && +matchGuard[0];

    if (newGuardId) {
      guardId = newGuardId;
    } else if (text === 'falls asleep') {
      startSleepMin = getMinute(time);
    } else {
      const endSleepMin = getMinute(time);
      const sleepArray = guardsSleepMap.get(guardId) || new Array(60).fill(0);

      for (let i = startSleepMin; i < endSleepMin; i++) {
        sleepArray[i] += 1;
      }

      guardsSleepMap.set(guardId, sleepArray);
      startSleepMin = null;
    }
  }

  return guardsSleepMap;
}
