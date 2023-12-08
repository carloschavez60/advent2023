import { readFileSync } from 'node:fs';

// const buf = readFileSync(process.cwd() + '/src/day3/test-input.txt'); // 4361 467835
const buf = readFileSync(process.cwd() + '/src/day3/input.txt'); // 556367 89471771
const input = buf.toString();
const lines = input.split('\n');
const ghostLine = ''.padStart(lines[0].length, '.');

// fill top and bot lines
lines.pop();
lines.unshift(ghostLine);
lines.push(ghostLine);

console.time('partOne');
partOne(lines);
console.timeEnd('partOne');

function partOne(lines: string[]) {
  let partNumbersSum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    let curNumber = '';
    for (let x = 0; x <= lines[0].length; x++) {
      const curChar = lines[y][x];
      if (isNumber(curChar)) {
        curNumber += curChar;
      } else if (curNumber.length > 0) {
        if (isPartNumber(curNumber, x - curNumber.length, y, lines)) {
          partNumbersSum += Number(curNumber);
        }
        // console.log(Number(curNumber));
        curNumber = '';
      }
    }
  }
  console.log(partNumbersSum);
}

function isNumber(char: string) {
  return !isNaN(parseInt(char));
}

function isPartNumber(number: string, x: number, y: number, lines: string[]) {
  const prevLine = lines[y - 1];
  const curLine = lines[y];
  const nextLine = lines[y + 1];

  let curNumberIsAdjacentToSymbol = false;
  if (isSymbol(curLine[x - 1]) || isSymbol(curLine[x + number.length])) {
    curNumberIsAdjacentToSymbol = true;
  }
  for (let k = x - 1; k <= x + number.length; k++) {
    if (isSymbol(prevLine[k]) || isSymbol(nextLine[k])) {
      curNumberIsAdjacentToSymbol = true;
    }
  }
  return curNumberIsAdjacentToSymbol;
}

/**
 * knowing that char is not a number
 */
function isSymbol(char: string) {
  return char !== undefined && !isDot(char);
}

function isDot(char: string) {
  return char === '.';
}
