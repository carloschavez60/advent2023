import { readFileLines } from '../utils.js';

class MapNumber {
  value: number;
  length: number;
  x: number;
  y: number;

  constructor(value: number, length: number, x: number, y: number) {
    this.value = value;
    this.length = length;
    this.x = x;
    this.y = y;
  }

  isPartNumber(lines: string[]): boolean {
    const { length, x, y } = this;
    const prevLine = lines[y - 1];
    const curLine = lines[y];
    const nextLine = lines[y + 1];

    if (isSymbol(curLine[x - 1]) || isSymbol(curLine[x + length])) {
      return true;
    }
    for (let k = x - 1; k <= x + length; k++) {
      if (isSymbol(prevLine[k]) || isSymbol(nextLine[k])) {
        return true;
      }
    }
    return false;
  }
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day3/test-input.txt'; // 4361 467835
  const filePath = process.cwd() + '/src/day3/input.txt'; // 556367 89471771

  const lines = readFileLines(filePath);
  fillEdges(lines);

  console.time('partOne');
  const partNumberSum = sumPartNumbers(lines);
  console.log(partNumberSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const gearRatioSum = sumGearRatios(lines);
  console.log(gearRatioSum);
  console.timeEnd('partTwo');
}

function fillEdges(lines: string[]) {
  const ghostLine = ''.padStart(lines[0].length + 2, '.');
  lines.unshift(ghostLine);
  lines.push(ghostLine);
  for (let y = 1; y < lines.length - 1; y++) {
    lines[y] = '.' + lines[y] + '.';
  }
}

function sumPartNumbers(lines: string[]): number {
  let sum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    for (let x = 1; x < lines[y].length - 1; x++) {
      const sn = findNearMapNumber(x, y, lines);
      if (sn !== undefined) {
        x += sn.length;
        if (sn.isPartNumber(lines)) {
          sum += sn.value;
        }
      }
    }
  }
  return sum;
}

function findNearMapNumber(
  x: number,
  y: number,
  lines: string[]
): MapNumber | undefined {
  if (!isStringDigit(lines[y][x])) {
    return undefined;
  }

  let strDigits = lines[y][x];
  let numX = x;

  for (let i = 1; isStringDigit(lines[y][x + i]); i++) {
    strDigits = strDigits + lines[y][x + i];
  }

  for (let i = 1; isStringDigit(lines[y][x - i]); i++) {
    strDigits = lines[y][x - i] + strDigits;
    numX--;
  }

  return new MapNumber(parseInt(strDigits), strDigits.length, numX, y);
}

function isStringDigit(char: string): boolean {
  return !isNaN(parseInt(char));
}

function sumGearRatios(lines: string[]): number {
  let sum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    for (let x = 1; x < lines[y].length - 1; x++) {
      if (lines[y][x] === '*') {
        sum += getGearRatio(x, y, lines);
      }
    }
  }
  return sum;
}

function getGearRatio(x: number, y: number, lines: string[]): number {
  const partNumbers: MapNumber[] = [];

  const leftNum = findNearMapNumber(x - 1, y, lines);
  if (leftNum !== undefined) {
    if (leftNum.isPartNumber(lines)) {
      partNumbers.push(leftNum);
    }
  }

  const rightNum = findNearMapNumber(x + 1, y, lines);
  if (rightNum !== undefined) {
    if (rightNum.isPartNumber(lines)) {
      partNumbers.push(rightNum);
    }
  }

  for (let i = x - 1; i <= x + 1; i++) {
    const topNum = findNearMapNumber(i, y - 1, lines);
    if (topNum !== undefined) {
      i = topNum.x + topNum.length;
      if (topNum.isPartNumber(lines)) {
        partNumbers.push(topNum);
      }
    }
  }

  for (let i = x - 1; i <= x + 1; i++) {
    const botNum = findNearMapNumber(i, y + 1, lines);
    if (botNum !== undefined) {
      i = botNum.x + botNum.length;
      if (botNum.isPartNumber(lines)) {
        partNumbers.push(botNum);
      }
    }
  }

  if (partNumbers.length !== 2) {
    return 0;
  }
  return partNumbers[0].value * partNumbers[1].value;
}

function isSymbol(char: string): boolean {
  return char !== '.' && !isStringDigit(char);
}
