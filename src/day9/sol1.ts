import { readFileLines } from '../utils.js';

main();

function main() {
  // const inputPath = process.cwd() + '/src/day9/test-input.txt'; // 114 2
  const inputPath = process.cwd() + '/src/day9/input.txt'; // 1898776583 1100

  const l = readFileLines(inputPath);
  const h = toHistories(l);

  console.time('partOne');
  const s = sumExtrapolatedValues(h);
  console.log(s);
  console.timeEnd('partOne');

  console.time('partTwo');
  const s2 = sumExtrapolatedValues2(h);
  console.log(s2);
  console.timeEnd('partTwo');
}

function toHistories(lines: string[]): number[][] {
  const histories: number[][] = [];
  for (const l of lines) {
    const history: number[] = [];
    for (const s of l.split(' ')) {
      history.push(Number(s));
    }
    histories.push(history);
  }
  return histories;
}

function sumExtrapolatedValues(histories: number[][]): number {
  let sum = 0;
  for (const h of histories) {
    sum += extrapolateNextValue(h);
  }
  return sum;
}

function extrapolateNextValue(history: number[]): number {
  let sum = history.at(-1)!;
  let cur = history;
  while (true) {
    const subhistory: number[] = [];
    for (let i = 0; i < cur.length - 1; i++) {
      const n = cur[i + 1] - cur[i];
      subhistory.push(n);
    }
    if (areZeroes(subhistory)) {
      break;
    }
    sum += subhistory.at(-1)!;
    cur = subhistory;
  }
  return sum;
}

function areZeroes(subhistory: number[]): boolean {
  for (const n of subhistory) {
    if (n !== 0) {
      return false;
    }
  }
  return true;
}

function sumExtrapolatedValues2(histories: number[][]): number {
  let sum = 0;
  for (const h of histories) {
    sum += extrapolatePrevValue(h);
  }
  return sum;
}

function extrapolatePrevValue(history: number[]): number {
  const subhistories: number[][] = [];
  let cur = history;
  while (true) {
    const subhistory: number[] = [];
    for (let i = 0; i < cur.length - 1; i++) {
      const num = cur[i + 1] - cur[i];
      subhistory.push(num);
    }
    if (areZeroes(subhistory)) {
      break;
    }
    subhistories.push(subhistory);
    cur = subhistory;
  }
  let prev = 0;
  for (let i = subhistories.length - 1; i >= 0; i--) {
    const s = subhistories[i];
    prev = s[0] - prev;
  }
  prev = history[0] - prev;
  return prev;
}
