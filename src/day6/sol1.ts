import { readFileSync } from 'fs';

interface Race {
  time: number;
  recordDistance: number;
}

// const filePath = process.cwd() + '/src/day6/test-input.txt';
const filePath = process.cwd() + '/src/day6/input.txt';

const races = getRaces(filePath);

// console.time('partOne');
// partOne(races);
// console.timeEnd('partOne');

const race = getRace(filePath);

console.time('partTwo');
partTwo(race);
console.timeEnd('partTwo');

function getRaces(filePath: string): Race[] {
  const fileStr = readFileSync(filePath, 'utf8');

  const lines = fileStr.split('\n');
  const times = getValues(lines[0]);
  const distances = getValues(lines[1]);

  const races: Race[] = [];
  for (let i = 0; i < times.length; i++) {
    races.push({
      time: times[i],
      recordDistance: distances[i],
    });
  }
  return races;
}

function getValues(line: string): number[] {
  return line
    .split(':')[1]
    .split(' ')
    .filter((x) => x !== '')
    .map((x) => +x);
}

function partOne(races: Race[]) {
  let product = 1;
  for (const race of races) {
    let waysToWinCount = 0;
    for (let i = 0; i <= race.time; i++) {
      const boatSpeed = i;
      const movingTime = race.time - i;
      const finalDistance = boatSpeed * movingTime;
      if (finalDistance > race.recordDistance) {
        waysToWinCount++;
      }
    }
    product *= waysToWinCount;
  }
  console.log(product);
}

function getRace(filePath: string): Race {
  const fileStr = readFileSync(filePath, 'utf8');

  const lines = fileStr.split('\n');
  const time = getValue(lines[0]);
  const distance = getValue(lines[1]);

  return {
    time: time,
    recordDistance: distance,
  };
}

function getValue(line: string): number {
  return +line
    .split(':')[1]
    .split(' ')
    .filter((x) => x !== '')
    .join('');
}

function partTwo(race: Race) {
  let waysToWinInit = 0;
  let waysToWinFinal = 0;
  for (let i = 0; waysToWinInit === 0; i++) {
    const boatSpeed = i;
    const movingTime = race.time - i;
    const finalDistance = boatSpeed * movingTime;
    if (finalDistance > race.recordDistance) {
      waysToWinInit = i;
    }
  }
  for (let i = race.time; waysToWinFinal === 0; i--) {
    const boatSpeed = i;
    const movingTime = race.time - i;
    const finalDistance = boatSpeed * movingTime;
    if (finalDistance > race.recordDistance) {
      waysToWinFinal = i;
    }
  }
  const waysToWin = waysToWinFinal - waysToWinInit + 1;
  console.log(waysToWin);
}
