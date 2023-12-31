import { readFileSync } from 'node:fs';

class NearNumber {
  value: string;
  x: number;
  y: number;

  constructor(value: string, x: number, y: number) {
    this.value = value;
    this.x = x;
    this.y = y;
  }
}

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
console.time('partTwo');
partTwo(lines);
console.timeEnd('partTwo');

function partOne(lines: string[]) {
  const lineLen = lines[0].length;
  let partNumbersSum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    let x = 0;
    while (x < lineLen) {
      if (isNumber(lines[y][x])) {
        const nearNumber = getNearNumber(x, y, lines);
        x += nearNumber.value.length - 1; // knowing nearNumber.x === x
        if (isPartNumber(nearNumber.value, nearNumber.x, nearNumber.y, lines)) {
          partNumbersSum += parseInt(nearNumber.value);
        }
      }
      x++;
    }
  }
  console.log('partNumbersSum: ', partNumbersSum);
}

function partTwo(lines: string[]) {
  const lineLen = lines[0].length;
  let gearRatiosSum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    let x = 0;
    while (x < lineLen) {
      if (isAsterisk(lines[y][x])) {
        gearRatiosSum += getGearRatio(x, y, lines);
      }
      x++;
    }
  }
  console.log('gearRatiosSum: ', gearRatiosSum);
}

function getGearRatio(x: number, y: number, lines: string[]): number {
  const partNumbers: NearNumber[] = [];
  let numbersCount = 0;

  if (isNumber(lines[y][x - 1])) {
    const leftNumber = getNearNumber(x - 1, y, lines);
    numbersCount++;
    if (isPartNumber(leftNumber.value, leftNumber.x, leftNumber.y, lines)) {
      partNumbers.push(leftNumber);
    }
  }

  if (isNumber(lines[y][x + 1])) {
    const rightNumber = getNearNumber(x + 1, y, lines);
    numbersCount++;
    if (isPartNumber(rightNumber.value, rightNumber.x, rightNumber.y, lines)) {
      partNumbers.push(rightNumber);
    }
  }

  let k = x - 1;
  while (k <= x + 1) {
    if (isNumber(lines[y - 1][k])) {
      const nearNumber = getNearNumber(k, y - 1, lines);
      k = nearNumber.x + nearNumber.value.length - 1;
      numbersCount++;
      if (isPartNumber(nearNumber.value, nearNumber.x, nearNumber.y, lines)) {
        partNumbers.push(nearNumber);
      }
    }
    k++;
  }

  k = x - 1;
  while (k <= x + 1) {
    if (isNumber(lines[y + 1][k])) {
      const nearNumber = getNearNumber(k, y + 1, lines);
      k = nearNumber.x + nearNumber.value.length - 1;
      numbersCount++;
      if (isPartNumber(nearNumber.value, nearNumber.x, nearNumber.y, lines)) {
        partNumbers.push(nearNumber);
      }
    }
    k++;
  }

  let gearRatio = 0;
  if (partNumbers.length === 2) {
    gearRatio = parseInt(partNumbers[0].value) * parseInt(partNumbers[1].value);
  }
  // print gear info
  // console.log(
  //   `pos: ${x} ${y}, numbersCount: ${numbersCount}, partNumbersCount: ${partNumbers.length}`
  // );
  // console.log(partNumbers);
  return gearRatio;
}

/**
 * Knowing isNumber(lines[y][x]) is true
 */
function getNearNumber(x: number, y: number, lines: string[]): NearNumber {
  let number = lines[y][x];
  let numX = x;

  let i = 1;
  while (isNumber(lines[y][x + i])) {
    number = number + lines[y][x + i];
    i++;
  }
  i = 1;
  while (isNumber(lines[y][x - i])) {
    number = lines[y][x - i] + number;
    numX--;
    i++;
  }

  return new NearNumber(number, numX, y);
}

function isNumber(char: string): boolean {
  return !isNaN(parseInt(char));
}

function isPartNumber(
  number: string,
  x: number,
  y: number,
  lines: string[]
): boolean {
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
function isSymbol(char: string): boolean {
  return char !== undefined && !isDot(char);
}

function isDot(char: string): boolean {
  return char === '.';
}

function isAsterisk(char: string): boolean {
  return char === '*';
}
