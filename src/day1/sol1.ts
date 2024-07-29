import { readFileSync } from 'node:fs';

const digitCharBySpelledDigit: ReadonlyMap<string, string> = new Map([
  ['one', '1'],
  ['two', '2'],
  ['three', '3'],
  ['four', '4'],
  ['five', '5'],
  ['six', '6'],
  ['seven', '7'],
  ['eight', '8'],
  ['nine', '9'],
]);

function day1Part1(filePath: string) {
  let lines = readFileLines(filePath);
  let part1Result = sumCalibrationValues(lines);
  console.log('part 1 result:', part1Result);
}

function readFileLines(filePath: string): string[] {
  let lines = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function sumCalibrationValues(lines: string[]): number {
  let sum = 0;
  for (let line of lines) {
    sum += getCalibrationValue(line);
  }
  return sum;
}

/**
 * Returns 0 if there are no digit characters on the line.
 */
function getCalibrationValue(line: string): number {
  let firstDigitChar = searchFirstDigitChar(line);
  if (firstDigitChar === undefined) {
    return 0;
  }
  let lastDigitChar = searchLastDigitChar(line);
  if (lastDigitChar === undefined) {
    return 0;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

function searchFirstDigitChar(line: string): string | undefined {
  for (let char of line) {
    if (isDigit(char)) {
      return char;
    }
  }
  return undefined;
}

function isDigit(char: string): boolean {
  return '0' <= char && char <= '9';
}

function searchLastDigitChar(line: string): string | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    let char = line[i];
    if (isDigit(char)) {
      return char;
    }
  }
  return undefined;
}

function day1Part2(filePath: string) {
  let lines = readFileLines(filePath);
  let part2Result = sumPart2CalibrationValues(lines);
  console.log('part 2 result:', part2Result);
}

function sumPart2CalibrationValues(lines: string[]): number {
  let sum = 0;
  for (let line of lines) {
    sum += getPart2CalibrationValue(line);
  }
  return sum;
}

/**
 * Returns 0 if there are no digit characters on the line.
 */
function getPart2CalibrationValue(line: string): number {
  let firstDigitChar = searchPart2FirstDigitChar(line);
  if (firstDigitChar === undefined) {
    return 0;
  }
  let lastDigitChar = searchPart2LastDigitChar(line);
  if (lastDigitChar === undefined) {
    return 0;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

function searchPart2FirstDigitChar(line: string): string | undefined {
  for (let i = 0; i < line.length; i++) {
    let char = line[i];
    if (isDigit(char)) {
      return char;
    }
    let digitChar = searchDigitCharAsSpelledDigit(line, i);
    if (digitChar !== undefined) {
      return digitChar;
    }
  }
  return undefined;
}

function searchPart2LastDigitChar(line: string): string | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    let char = line[i];
    if (isDigit(char)) {
      return char;
    }
    let digitChar = searchDigitCharAsSpelledDigit(line, i);
    if (digitChar !== undefined) {
      return digitChar;
    }
  }
  return undefined;
}

function searchDigitCharAsSpelledDigit(
  line: string,
  position: number
): string | undefined {
  for (let [spelledDigit, digitChar] of digitCharBySpelledDigit.entries()) {
    if (line.startsWith(spelledDigit, position)) {
      return digitChar;
    }
  }
  return undefined;
}

let testFilePath = process.cwd() + '/src/day1/test-input.txt';
let testFile2Path = process.cwd() + '/src/day1/part-two-test-input.txt';
let filePath = process.cwd() + '/src/day1/input.txt';

day1Part1(testFilePath); // 142
day1Part2(testFile2Path); // 281

day1Part1(filePath); // 54573
day1Part2(filePath); // 54591
