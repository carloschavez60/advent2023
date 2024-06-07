import { readFileSync } from 'node:fs';

class MapNumber {
  readonly value: number;
  readonly length: number;
  readonly x: number;
  readonly y: number;

  readonly #lines: readonly string[];

  constructor(
    value: number,
    length: number,
    x: number,
    y: number,
    lines: readonly string[]
  ) {
    this.value = value;
    this.length = length;
    this.x = x;
    this.y = y;
    this.#lines = lines;
  }

  get isPartNumber(): boolean {
    const leftChar = this.#lines[this.y][this.x - 1];
    if (this.#isSymbol(leftChar)) {
      return true;
    }
    const rightChar = this.#lines[this.y][this.x + this.length];
    if (this.#isSymbol(rightChar)) {
      return true;
    }
    for (let i = this.x - 1; i <= this.x + this.length; i++) {
      const topChar = this.#lines[this.y - 1][i];
      if (this.#isSymbol(topChar)) {
        return true;
      }
      const bottomChar = this.#lines[this.y + 1][i];
      if (this.#isSymbol(bottomChar)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Make sure char is not a digit character.
   */
  #isSymbol(char: string): boolean {
    return char !== '.';
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
  const lines: string[] = readFileSync(path, 'utf8').split('\n');
  if (lines.at(-1) === '') {
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
      const char = lines[y][x];
      if (isDigit(char)) {
        const mapNumber: MapNumber = getNearMapNumber(x, y, lines);
        x += mapNumber.length;
        if (mapNumber.isPartNumber) {
          sum += mapNumber.value;
        }
      }
    }
  }
  return sum;
}

function isDigit(char: string): boolean {
  return '0' <= char && char <= '9';
}

/**
 * Make sure lines[y][x] is digit character.
 */
function getNearMapNumber(
  x: number,
  y: number,
  lines: readonly string[]
): MapNumber {
  let digitChars = lines[y][x];
  for (let i = 1; isDigit(lines[y][x + i]); i++) {
    digitChars = digitChars + lines[y][x + i];
  }
  let mapNumberX = x;
  for (let i = 1; isDigit(lines[y][x - i]); i++) {
    digitChars = lines[y][x - i] + digitChars;
    mapNumberX--;
  }
  return new MapNumber(
    parseInt(digitChars),
    digitChars.length,
    mapNumberX,
    y,
    lines
  );
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

function getGearRatio(x: number, y: number, lines: readonly string[]): number {
  let auxPartNumber: MapNumber | undefined;
  const leftChar = lines[y][x - 1];
  if (isDigit(leftChar)) {
    const mapNumber = getNearMapNumber(x - 1, y, lines);
    if (mapNumber.isPartNumber) {
      auxPartNumber = mapNumber;
    }
  }
  const rightChar = lines[y][x + 1];
  if (isDigit(rightChar)) {
    const mapNumber = getNearMapNumber(x + 1, y, lines);
    if (mapNumber.isPartNumber) {
      if (auxPartNumber !== undefined) {
        return auxPartNumber.value * mapNumber.value;
      }
      auxPartNumber = mapNumber;
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    const topChar = lines[y - 1][i];
    if (isDigit(topChar)) {
      const mapNumber = getNearMapNumber(i, y - 1, lines);
      i = mapNumber.x + mapNumber.length;
      if (mapNumber.isPartNumber) {
        if (auxPartNumber !== undefined) {
          return auxPartNumber.value * mapNumber.value;
        }
        auxPartNumber = mapNumber;
      }
    }
  }
  for (let i = x - 1; i <= x + 1; i++) {
    const bottomChar = lines[y + 1][i];
    if (isDigit(bottomChar)) {
      const mapNumber = getNearMapNumber(i, y + 1, lines);
      i = mapNumber.x + mapNumber.length;
      if (mapNumber.isPartNumber) {
        if (auxPartNumber !== undefined) {
          return auxPartNumber.value * mapNumber.value;
        }
        auxPartNumber = mapNumber;
      }
    }
  }
  return 0;
}
