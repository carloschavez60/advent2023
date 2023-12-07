import { readFileSync } from 'node:fs';

const buf = readFileSync(process.cwd() + '/src/day3/test-input.txt');
// const buf = readFileSync(process.cwd() + '/src/day3/input.txt');
const input = buf.toString();

console.time('time');

const lines = input.split('\n');
const lineLen = lines[0].length;
const ghostLine = ''.padStart(lineLen, '.');

// fill top and bot lines
lines.pop();
lines.unshift(ghostLine);
lines.push(ghostLine);

let totalSum = 0;
for (let y = 1; y < lines.length - 1; y++) {
  let curNumber = '';
  for (let x = 0; x <= lineLen; x++) {
    const curChar = lines[y][x];
    if (isCharNumber(curChar)) {
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
console.timeEnd('time');
console.log(totalSum);

function isCharNumber(char: string) {
  // const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  // return numbers.includes(number);
  return !isNaN(parseInt(char));
}

function isPartNumber(number: string, x: number, y: number, lines: string[]) {
  const prevLine = lines[y - 1];
  const curLine = lines[y];
  const nextLine = lines[y + 1];

  let curNumberIsAdjacentToSymbol = false;
  let curNumberLen = number.length;
  if (
    (curLine[x] && curLine[x] !== '.') ||
    (curLine[x - curNumberLen - 1] && curLine[x - curNumberLen - 1] !== '.')
  ) {
    curNumberIsAdjacentToSymbol = true;
  }
  for (let k = x - curNumberLen - 1; k <= x; k++) {
    if (
      (prevLine[k] && prevLine[k] !== '.') ||
      (nextLine[k] && nextLine[k] !== '.')
    ) {
      curNumberIsAdjacentToSymbol = true;
    }
  }
  return curNumberIsAdjacentToSymbol;
}
