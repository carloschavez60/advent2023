import { readFileLines } from '../utils.js';

class StringNumber {
  value: string;
  x: number;
  y: number;

  constructor(value: string, x: number, y: number) {
    this.value = value;
    this.x = x;
    this.y = y;
  }
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day3/test-input.txt'; // 4361 467835
  const filePath = process.cwd() + '/src/day3/input.txt'; // 556367 89471771

  const lines = readFileLines(filePath);
  const ghostLine = ''.padStart(lines[0].length, '.');
  lines.unshift(ghostLine);
  lines.push(ghostLine);

  console.time('partOne');
  const partNumberSum = partOne(lines);
  console.log(partNumberSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const gearRatioSum = partTwo(lines);
  console.log(gearRatioSum);
  console.timeEnd('partTwo');
}

function partOne(lines: string[]): number {
  let sum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    let x = 0;
    while (x < lines[y].length) {
      if (isNumber(lines[y][x])) {
        const sn = getNearStringNumber(x, y, lines);
        x += sn.value.length; // knowing nearNumber.x === x
        if (isPartNumber(sn, lines)) {
          sum += parseInt(sn.value);
        }
      }
      x++;
    }
  }
  return sum;
}

function partTwo(lines: string[]): number {
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
  return gearRatiosSum;
}

function getGearRatio(x: number, y: number, lines: string[]): number {
  const partNumbers: StringNumber[] = [];
  let numbersCount = 0;

  if (isNumber(lines[y][x - 1])) {
    const leftNumber = getNearStringNumber(x - 1, y, lines);
    numbersCount++;
    if (isPartNumber(leftNumber, lines)) {
      partNumbers.push(leftNumber);
    }
  }

  if (isNumber(lines[y][x + 1])) {
    const rightNumber = getNearStringNumber(x + 1, y, lines);
    numbersCount++;
    if (isPartNumber(rightNumber, lines)) {
      partNumbers.push(rightNumber);
    }
  }

  let k = x - 1;
  while (k <= x + 1) {
    if (isNumber(lines[y - 1][k])) {
      const nearNumber = getNearStringNumber(k, y - 1, lines);
      k = nearNumber.x + nearNumber.value.length - 1;
      numbersCount++;
      if (isPartNumber(nearNumber, lines)) {
        partNumbers.push(nearNumber);
      }
    }
    k++;
  }

  k = x - 1;
  while (k <= x + 1) {
    if (isNumber(lines[y + 1][k])) {
      const nearNumber = getNearStringNumber(k, y + 1, lines);
      k = nearNumber.x + nearNumber.value.length - 1;
      numbersCount++;
      if (isPartNumber(nearNumber, lines)) {
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
function getNearStringNumber(
  x: number,
  y: number,
  lines: string[]
): StringNumber {
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

  return new StringNumber(number, numX, y);
}

function isNumber(char: string): boolean {
  return !isNaN(parseInt(char));
}

function isPartNumber(stringNumber: StringNumber, lines: string[]): boolean {
  const prevLine = lines[stringNumber.y - 1];
  const curLine = lines[stringNumber.y];
  const nextLine = lines[stringNumber.y + 1];

  let is = false;
  if (
    isSymbol(curLine[stringNumber.x - 1]) ||
    isSymbol(curLine[stringNumber.x + stringNumber.value.length])
  ) {
    is = true;
  }
  for (
    let k = stringNumber.x - 1;
    k <= stringNumber.x + stringNumber.value.length;
    k++
  ) {
    if (isSymbol(prevLine[k]) || isSymbol(nextLine[k])) {
      is = true;
    }
  }
  return is;
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
