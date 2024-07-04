import { readFileSync } from 'node:fs';

class Race {
  time: number;
  recordDistance: number;

  constructor(time: number, recordDistance: number) {
    this.time = time;
    this.recordDistance = recordDistance;
  }
}

function day6Part1(filePath: string) {
  const races: Race[] = readRacesFromFile(filePath);

  const part1Result: number = multiplyWaysToWin(races);
  console.log('part 1 result:', part1Result);
}

function readRacesFromFile(filePath: string): Race[] {
  const lines: string[] = readFileLines(filePath);
  const times: number[] = [];
  const distances: number[] = [];
  for (const timeStr of lines[0].split(':')[1].trimStart().split(' ')) {
    if (timeStr !== '') {
      times.push(parseInt(timeStr));
    }
  }
  for (const distanceStr of lines[1].split(':')[1].trimStart().split(' ')) {
    if (distanceStr !== '') {
      distances.push(parseInt(distanceStr));
    }
  }
  const races: Race[] = [];
  for (let i = 0; i < times.length; i++) {
    races.push(new Race(times[i], distances[i]));
  }
  return races;
}

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function multiplyWaysToWin(races: readonly Race[]): number {
  let prod = 1;
  for (const race of races) {
    prod *= countWaysToWin(race);
  }
  return prod;
}

function countWaysToWin(race: Race): number {
  let count = 0;
  for (let i = 0; i <= race.time; i++) {
    const boatSpeed: number = i;
    const movingTime: number = race.time - i;
    const distance: number = boatSpeed * movingTime;
    if (distance > race.recordDistance) {
      count++;
    }
  }
  return count;
}

function day6Part2(filePath: string) {
  const race: Race = readRaceFromFile(filePath);

  const part2Result: number = countPart2WaysToWin(race);
  console.log('part 2 result:', part2Result);
}

function readRaceFromFile(filePath: string): Race {
  const lines: string[] = readFileLines(filePath);
  let timeStr = '';
  let distanceStr = '';
  for (const partialTimeStr of lines[0].split(':')[1].trimStart().split(' ')) {
    if (partialTimeStr !== '') {
      timeStr += partialTimeStr;
    }
  }
  for (const partialDistanceStr of lines[1]
    .split(':')[1]
    .trimStart()
    .split(' ')) {
    if (partialDistanceStr !== '') {
      distanceStr += partialDistanceStr;
    }
  }
  return new Race(parseInt(timeStr), parseInt(distanceStr));
}

function countPart2WaysToWin(race: Race): number {
  let start: number | undefined;
  let end: number | undefined;
  for (let i = 0; start === undefined; i++) {
    const boatSpeed: number = i;
    const movingTime: number = race.time - i;
    const distance: number = boatSpeed * movingTime;
    if (distance > race.recordDistance) {
      start = i;
    }
  }
  for (let i = race.time; end === undefined; i--) {
    const boatSpeed: number = i;
    const movingTime: number = race.time - i;
    const distance: number = boatSpeed * movingTime;
    if (distance > race.recordDistance) {
      end = i;
    }
  }
  return end - start + 1;
}

const testFilePath = process.cwd() + '/src/day6/test-input.txt';
const filePath = process.cwd() + '/src/day6/input.txt';

day6Part1(testFilePath); // 288
day6Part2(testFilePath); // 71503

day6Part1(filePath); // 1312850
day6Part2(filePath); // 36749103
