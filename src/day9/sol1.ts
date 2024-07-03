import { readFileSync } from 'node:fs';

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

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
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
  let sum = history[0];
  let cur = history;
  for (let i = 0; true; i++) {
    const subhistory: number[] = [];
    for (let j = 0; j < cur.length - 1; j++) {
      const num = cur[j + 1] - cur[j];
      subhistory.push(num);
    }
    if (areZeroes(subhistory)) {
      break;
    }
    if (i % 2 === 0) {
      sum -= subhistory[0];
    } else {
      sum += subhistory[0];
    }
    cur = subhistory;
  }
  return sum;
}
