let { computePowerLevel } = require('./day11.js');


const cases = [{
  x: 3,
  y: 5,
  serial: 8,
  result: 4
}, {
  x: 122,
  y: 79,
  serial: 57,
  result: -5
}, {
  x: 217,
  y: 196,
  serial: 39,
  result: 0
},  {
  x: 101,
  y: 153,
  serial: 71,
  result: 4
}];

for (let c of cases) {
  const power = computePowerLevel(c.x, c.y, c.serial);
  console.log(power === c.result ? 'Success' : 'Fails');
}
