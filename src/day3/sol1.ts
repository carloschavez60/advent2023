import { readFileSync } from 'node:fs';

const buf = readFileSync(process.cwd() + '/src/day3/test-input.txt');
// const buf = readFileSync(process.cwd() + '/src/day3/input.txt');
const input = buf.toString();
const lines = input.split('\n');
const ghostLine = ''.padStart(lines[0].length, '.');

// fill top and bot lines
lines.pop();
lines.unshift(ghostLine);
lines.push(ghostLine);

console.time('time');
partOne(lines);
console.timeEnd('time');

function partOne(lines: string[]) {
  let totalSum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    let curNumber = '';
    for (let x = 0; x <= lines[0].length; x++) {
      const curChar = lines[y][x];
      if (isNumber(curChar)) {
        curNumber += curChar;
      } else if (curNumber.length > 0) {
        if (isPartNumber(curNumber, x, y, lines)) {
          totalSum += Number(curNumber);
        }

        // console.log(Number(curNumber));

        curNumber = '';
      }
    }
  }
  // console.timeEnd('time');
  console.log(totalSum);
}

function isNumber(char: string) {
  return !isNaN(parseInt(char));
}

function isPartNumber(number: string, x: number, y: number, lines: string[]) {
  const prevLine = lines[y - 1];
  const curLine = lines[y];
  const nextLine = lines[y + 1];

  let curNumberIsAdjacentToSymbol = false;
  let curNumberLen = number.length;
  if (
    (curLine[x] !== undefined && !isDot(curLine[x])) ||
    (curLine[x - curNumberLen - 1] !== undefined &&
      curLine[x - curNumberLen - 1] !== '.')
  ) {
    curNumberIsAdjacentToSymbol = true;
  }
  for (let k = x - curNumberLen - 1; k <= x; k++) {
    if (
      (prevLine[k] !== undefined && !isDot(prevLine[k])) ||
      (nextLine[k] !== undefined && !isDot(nextLine[k]))
    ) {
      curNumberIsAdjacentToSymbol = true;
    }
  }
  return curNumberIsAdjacentToSymbol;
}

function isDot(char: string) {
  return char === '.';
}

function isAsterisk(char: string) {
  return char === '*';
}
