import { readFileSync } from 'node:fs';

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
    if (isSymbol(lines[y][x - 1]) || isSymbol(lines[y][x + length])) {
      return true;
    }
    for (let i = x - 1; i <= x + length; i++) {
      if (isSymbol(lines[y - 1][i]) || isSymbol(lines[y + 1][i])) {
        return true;
      }
    }
    return false;
  }
}

main();

function main() {
  // const inputFilePath = process.cwd() + '/src/day3/test-input.txt'; // 4361 467835
  const inputFilePath = process.cwd() + '/src/day3/input.txt'; // 556367 89471771

  console.time('partOne');
  const lines: string[] = readInputFileLines(inputFilePath);
  fillEdges(lines);

  const sum: number = sumPartNumbers(lines);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2: number = sumGearRatios(lines);
  console.log(sum2);
  console.timeEnd('partTwo');
}

function readInputFileLines(inputFilePath: string): string[] {
  const lines = readFileSync(inputFilePath, 'utf8').split('\n');
  lines.pop();
  return lines;
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
      if (isStringDigit(lines[y][x])) {
        const n = getNearMapNumber(x, y, lines);
        x += n.length;
        if (n.isPartNumber(lines)) {
          sum += n.value;
        }
      }
    }
  }
  return sum;
}

function getNearMapNumber(x: number, y: number, lines: string[]): MapNumber {
  let sdigits = lines[y][x];
  let numX = x;
  for (let i = 1; isStringDigit(lines[y][x + i]); i++) {
    sdigits = sdigits + lines[y][x + i];
  }
  for (let i = 1; isStringDigit(lines[y][x - i]); i++) {
    sdigits = lines[y][x - i] + sdigits;
    numX--;
  }
  return new MapNumber(Number(sdigits), sdigits.length, numX, y);
}

function isStringDigit(char: string): boolean {
  return !isNaN(Number(char));
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
  let auxn: MapNumber;
  let count = 0;
  if (isStringDigit(lines[y][x - 1])) {
    const n = getNearMapNumber(x - 1, y, lines);
    if (n.isPartNumber(lines)) {
      count++;
      auxn = n;
    }
  }
  if (isStringDigit(lines[y][x + 1])) {
    const n = getNearMapNumber(x + 1, y, lines);
    if (n.isPartNumber(lines)) {
      count++;
      if (count === 2) {
        return auxn!.value * n.value;
      }
      auxn = n;
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    if (isStringDigit(lines[y - 1][i])) {
      const n = getNearMapNumber(i, y - 1, lines);
      i = n.x + n.length;
      if (n.isPartNumber(lines)) {
        count++;
        if (count === 2) {
          return auxn!.value * n.value;
        }
        auxn = n;
      }
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    if (isStringDigit(lines[y + 1][i])) {
      const n = getNearMapNumber(i, y + 1, lines);
      i = n.x + n.length;
      if (n.isPartNumber(lines)) {
        count++;
        if (count === 2) {
          return auxn!.value * n.value;
        }
        auxn = n;
      }
    }
  }
  return 0;
}

function isSymbol(char: string): boolean {
  return char !== '.';
}
