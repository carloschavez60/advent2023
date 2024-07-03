import { readFileSync } from 'node:fs';

class MapNumber {
  readonly value: number;
  readonly length: number;
  readonly x: number;
  readonly y: number;

  constructor(value: number, length: number, x: number, y: number) {
    this.value = value;
    this.length = length;
    this.x = x;
    this.y = y;
  }

  isPartNumber(lines: readonly string[]): boolean {
    const leftChar: string = lines[this.y][this.x - 1];
    if (isSymbol(leftChar)) {
      return true;
    }
    const rightChar: string = lines[this.y][this.x + this.length];
    if (isSymbol(rightChar)) {
      return true;
    }
    for (let i = this.x - 1; i <= this.x + this.length; i++) {
      const topChar: string = lines[this.y - 1][i];
      if (isSymbol(topChar)) {
        return true;
      }
      const bottomChar: string = lines[this.y + 1][i];
      if (isSymbol(bottomChar)) {
        return true;
      }
    }
    return false;
  }
}

function isSymbol(char: string): boolean {
  return char !== '.' && !('0' <= char && char <= '9');
}

function day3Part1(filePath: string) {
  const lines: string[] = readFileLines(filePath);
  fillEdges(lines); // Mutates lines

  const part1Result: number = sumPartNumbers(lines);
  console.log('part 1 result:', part1Result);
}

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

/**
 * Mutates lines.
 */
function fillEdges(lines: string[]) {
  const ghostLine: string = ''.padStart(lines[0].length + 2, '.');
  lines.unshift(ghostLine);
  lines.push(ghostLine);
  for (let y = 1; y < lines.length - 1; y++) {
    lines[y] = '.' + lines[y] + '.';
  }
}

function sumPartNumbers(lines: readonly string[]): number {
  let sum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    for (let x = 1; x < lines[y].length - 1; x++) {
      const char: string = lines[y][x];
      if (isDigit(char)) {
        const mapNumber: MapNumber = getNearMapNumber(x, y, lines);
        if (mapNumber.isPartNumber(lines)) {
          sum += mapNumber.value;
        }
        x += mapNumber.length;
      }
    }
  }
  return sum;
}

function isDigit(char: string): boolean {
  return '0' <= char && char <= '9';
}

/**
 * Precondition: lines[y][x] is digit character.
 */
function getNearMapNumber(
  x: number,
  y: number,
  lines: readonly string[]
): MapNumber {
  let digitChars: string = lines[y][x];
  for (let i = 1; isDigit(lines[y][x + i]); i++) {
    digitChars = digitChars + lines[y][x + i];
  }
  let mapNumberX: number = x;
  for (let i = 1; isDigit(lines[y][x - i]); i++) {
    digitChars = lines[y][x - i] + digitChars;
    mapNumberX--;
  }
  return new MapNumber(parseInt(digitChars), digitChars.length, mapNumberX, y);
}

function day3Part2(filePath: string) {
  const lines: string[] = readFileLines(filePath);
  fillEdges(lines); // Mutates lines

  const part2Result: number = sumGearRatios(lines);
  console.log('part 2 result:', part2Result);
}

function sumGearRatios(lines: readonly string[]): number {
  let sum = 0;
  for (let y = 1; y < lines.length - 1; y++) {
    for (let x = 1; x < lines[y].length - 1; x++) {
      const char: string = lines[y][x];
      if (isGear(char)) {
        sum += getGearRatio(x, y, lines);
      }
    }
  }
  return sum;
}

function isGear(char: string): boolean {
  return char === '*';
}

/**
 * Returns 0 if there are no part numbers.
 */
function getGearRatio(x: number, y: number, lines: readonly string[]): number {
  let auxPartNumber: MapNumber | undefined;
  const leftChar: string = lines[y][x - 1];
  if (isDigit(leftChar)) {
    const mapNumber: MapNumber = getNearMapNumber(x - 1, y, lines);
    if (mapNumber.isPartNumber(lines)) {
      auxPartNumber = mapNumber;
    }
  }
  const rightChar: string = lines[y][x + 1];
  if (isDigit(rightChar)) {
    const mapNumber: MapNumber = getNearMapNumber(x + 1, y, lines);
    if (mapNumber.isPartNumber(lines)) {
      if (auxPartNumber !== undefined) {
        return auxPartNumber.value * mapNumber.value;
      }
      auxPartNumber = mapNumber;
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    const topChar: string = lines[y - 1][i];
    if (isDigit(topChar)) {
      const mapNumber: MapNumber = getNearMapNumber(i, y - 1, lines);
      if (mapNumber.isPartNumber(lines)) {
        if (auxPartNumber !== undefined) {
          return auxPartNumber.value * mapNumber.value;
        }
        auxPartNumber = mapNumber;
      }
      i = mapNumber.x + mapNumber.length;
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    const bottomChar: string = lines[y + 1][i];
    if (isDigit(bottomChar)) {
      const mapNumber: MapNumber = getNearMapNumber(i, y + 1, lines);
      if (mapNumber.isPartNumber(lines)) {
        if (auxPartNumber !== undefined) {
          return auxPartNumber.value * mapNumber.value;
        }
        auxPartNumber = mapNumber;
      }
      i = mapNumber.x + mapNumber.length;
    }
  }
  return 0;
}

const testFilePath = process.cwd() + '/src/day3/test-input.txt';
const filePath = process.cwd() + '/src/day3/input.txt';

day3Part1(testFilePath); // 4361
day3Part2(testFilePath); // 467835

day3Part1(filePath); // 556367
day3Part2(filePath); // 89471771
