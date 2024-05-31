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
  const testFilePath = process.cwd() + '/src/day3/test-input.txt'; // 4361 467835
  const filePath = process.cwd() + '/src/day3/input.txt'; // 556367 89471771

  day3(testFilePath);
  day3(filePath);
}

function day3(filePath: string) {
  console.time('day3');

  const lines: string[] = readFileLines(filePath);
  fillEdges(lines); // Mutates lines

  const part1Result: number = sumPartNumbers(lines);
  console.log('part 1 result:', part1Result);

  const part2Result: number = sumGearRatios(lines);
  console.log('part 2 result:', part2Result);

  console.timeEnd('day3');
}

function readFileLines(path: string): string[] {
  const lines = readFileSync(path, 'utf8').split('\n');
  if (lines.at(-1) === '') {
    lines.pop();
  }
  return lines;
}

/**
 * Mutates lines
 */
function fillEdges(lines: string[]) {
  const ghostLine: string = ''.padStart(lines[0].length + 2, '.');
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
      const partNumber: MapNumber | undefined = findPartNumber(x, y, lines);
      if (partNumber !== undefined) {
        sum += partNumber.value;
        x += partNumber.length;
      }
    }
  }
  return sum;
}

function findPartNumber(
  x: number,
  y: number,
  lines: string[]
): MapNumber | undefined {
  const char = lines[y][x];
  if (!isDigit(char)) {
    return undefined;
  }
  const mapNumber: MapNumber = getNearMapNumber(x, y, lines);
  if (!mapNumber.isPartNumber(lines)) {
    return undefined;
  }
  return mapNumber;
}

function getNearMapNumber(x: number, y: number, lines: string[]): MapNumber {
  let sdigits = lines[y][x];

  for (let i = 1; isDigit(lines[y][x + i]); i++) {
    sdigits = sdigits + lines[y][x + i];
  }
  let numX = x;
  for (let i = 1; isDigit(lines[y][x - i]); i++) {
    sdigits = lines[y][x - i] + sdigits;
    numX--;
  }
  return new MapNumber(Number(sdigits), sdigits.length, numX, y);
}

function isDigit(char: string): boolean {
  return '0' <= char && char <= '9';
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
  if (isDigit(lines[y][x - 1])) {
    const n = getNearMapNumber(x - 1, y, lines);
    if (n.isPartNumber(lines)) {
      count++;
      auxn = n;
    }
  }
  if (isDigit(lines[y][x + 1])) {
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
    if (isDigit(lines[y - 1][i])) {
      const n = getNearMapNumber(i, y - 1, lines);
      if (n.isPartNumber(lines)) {
        count++;
        if (count === 2) {
          return auxn!.value * n.value;
        }
        auxn = n;
      }
      i = n.x + n.length;
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    if (isDigit(lines[y + 1][i])) {
      const n = getNearMapNumber(i, y + 1, lines);
      if (n.isPartNumber(lines)) {
        count++;
        if (count === 2) {
          return auxn!.value * n.value;
        }
        auxn = n;
      }
      i = n.x + n.length;
    }
  }
  return 0;
}

function isSymbol(char: string): boolean {
  return char !== '.';
}
