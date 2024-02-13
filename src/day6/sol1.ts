import { readFileLines } from '../utils.js';

class Race {
  time: number;
  recordDistance: number;

  constructor(time: number, recordDistance: number) {
    this.time = time;
    this.recordDistance = recordDistance;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day6/test-input.txt'; // 288 71503
  const inputPath = process.cwd() + '/src/day6/input.txt'; // 1312850 36749103

  const l = readFileLines(inputPath);
  const rs = toRaces(l);

  console.time('partOne');
  const p = multiplyWaysToWin(rs);
  console.log(p);
  console.timeEnd('partOne');

  const r = toRace(l);

  console.time('partTwo');
  const c = countWaysToWin(r);
  console.log(c);
  console.timeEnd('partTwo');
}

function toRaces(lines: string[]): Race[] {
  const times: number[] = [];
  const distances: number[] = [];
  for (const s of lines[0].split(':')[1].trimStart().split(' ')) {
    if (s !== '') {
      times.push(Number(s));
    }
  }
  for (const s of lines[1].split(':')[1].trimStart().split(' ')) {
    if (s !== '') {
      distances.push(Number(s));
    }
  }
  const races: Race[] = [];
  for (let i = 0; i < times.length; i++) {
    races.push(new Race(times[i], distances[i]));
  }
  return races;
}

function multiplyWaysToWin(races: Race[]): number {
  let prod = 1;
  for (const r of races) {
    let count = 0;
    for (let i = 0; i <= r.time; i++) {
      const boatSpeed = i;
      const movingTime = r.time - i;
      const distance = boatSpeed * movingTime;
      if (distance > r.recordDistance) {
        count++;
      }
    }
    prod *= count;
  }
  return prod;
}

function toRace(lines: string[]): Race {
  let stime = '';
  let sdistance = '';
  for (const s of lines[0].split(':')[1].trimStart().split(' ')) {
    if (s !== '') {
      stime += s;
    }
  }
  for (const s of lines[1].split(':')[1].trimStart().split(' ')) {
    if (s !== '') {
      sdistance += s;
    }
  }

  return new Race(Number(stime), Number(sdistance));
}

function countWaysToWin(r: Race): number {
  let start = 0;
  let final = 0;
  for (let i = 0; start === 0; i++) {
    const boatSpeed = i;
    const movingTime = r.time - i;
    const distance = boatSpeed * movingTime;
    if (distance > r.recordDistance) {
      start = i;
    }
  }
  for (let i = r.time; final === 0; i--) {
    const boatSpeed = i;
    const movingTime = r.time - i;
    const distance = boatSpeed * movingTime;
    if (distance > r.recordDistance) {
      final = i;
    }
  }
  return final - start + 1;
}
