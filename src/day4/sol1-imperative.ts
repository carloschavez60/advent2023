import { readFileSync } from 'node:fs';

// const buf = readFileSync(process.cwd() + '/src/day4/test-input.txt'); // 13 30
const buf = readFileSync(process.cwd() + '/src/day4/input.txt'); // 23673 12263631
const input = buf.toString();
const lines = input.split('\n');
lines.pop();

console.time('partOne');
partOne(lines);
console.timeEnd('partOne');
console.time('partTwo');
partTwo(lines);
console.timeEnd('partTwo');

function partOne(lines: string[]) {
  let pileWorth = 0;
  for (const line of lines) {
    const myWinNumsCount = getMyWinNumsCount(line);
    if (myWinNumsCount !== 0) {
      pileWorth += Math.pow(2, myWinNumsCount - 1);
    }
  }
  console.log(pileWorth);
}

function partTwo(lines: string[]) {
  const copiesArr: number[] = [];
  let totalCards = 0;
  for (const line of lines) {
    const copies = copiesArr.shift() ?? 0;
    const instances = 1 + copies;
    totalCards += instances;
    const myWinNumsCount = getMyWinNumsCount(line);
    for (let i = 0; i < myWinNumsCount; i++) {
      if (copiesArr[i] !== undefined) {
        copiesArr[i] += instances;
      } else {
        copiesArr.push(instances);
      }
    }
    // console.log(copiesArr);
  }
  console.log(totalCards);
}

function getMyWinNumsCount(line: string) {
  const [_, nums] = line.split(':');
  const [wStr, myStr] = nums.split('|');
  const winNums = toNumArray(wStr);
  const myNums = toNumArray(myStr);

  let myWinNumCount = 0;
  for (const myNum of myNums) {
    for (const winNum of winNums) {
      if (myNum === winNum) {
        myWinNumCount++;
      }
    }
  }
  return myWinNumCount;
}

function toNumArray(str: string) {
  return str
    .split(' ')
    .filter((elem) => elem !== '')
    .map((str) => parseInt(str));
}
