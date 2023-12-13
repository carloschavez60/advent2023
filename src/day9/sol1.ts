import { readFileSync } from 'fs';

// const filePath = process.cwd() + '/src/day9/test-input.txt';
const filePath = process.cwd() + '/src/day9/input.txt'; // 1898776583 1100

const histories: number[][] = getHistories(filePath);

console.time('partOne');
partOne(histories);
console.timeEnd('partOne');

console.time('partTwo');
partTwo(histories);
console.timeEnd('partTwo');

function getHistories(filePath: string): number[][] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.pop();
  return lines.map((line) => {
    return line.split(' ').map((x) => +x);
  });
}

function partOne(histories: number[][]) {
  let extrapolatedValuesSum = 0;
  for (const history of histories) {
    const subhistories: number[][] = [];

    let curSubhistory: number[] = history;
    while (!areZeroes(curSubhistory)) {
      const subhistory: number[] = [];
      for (let i = 0; i < curSubhistory.length - 1; i++) {
        const num = curSubhistory[i + 1] - curSubhistory[i];
        subhistory.push(num);
      }
      subhistories.push(subhistory);
      curSubhistory = subhistory;
    }

    const nextValue = subhistories.reduce(
      (acc, subhistory) => acc + subhistory.at(-1)!,
      history.at(-1)!
    );

    extrapolatedValuesSum += nextValue;
  }
  console.log(extrapolatedValuesSum);
}

function areZeroes(subhistory: number[]): boolean {
  for (const num of subhistory) {
    if (num !== 0) {
      return false;
    }
  }
  return true;
}

function partTwo(histories: number[][]) {
  let extrapolatedValuesSum = 0;
  for (const history of histories) {
    const subhistories: number[][] = [];

    let curSubhistory: number[] = history;
    while (!areZeroes(curSubhistory)) {
      const subhistory: number[] = [];
      for (let i = 0; i < curSubhistory.length - 1; i++) {
        const num = curSubhistory[i + 1] - curSubhistory[i];
        subhistory.push(num);
      }
      subhistories.push(subhistory);
      curSubhistory = subhistory;
    }

    let firstValue = 0;
    for (let j = subhistories.length - 1; j >= 0; j--) {
      const subhistory = subhistories[j];
      firstValue = subhistory[0] - firstValue;
    }
    firstValue = history[0] - firstValue;

    extrapolatedValuesSum += firstValue;
  }
  console.log(extrapolatedValuesSum);
}
