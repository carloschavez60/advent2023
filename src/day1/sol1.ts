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

function readFileLines(filePath: string): string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function day1Part1(filePath: string): number {
  const lines = readFileLines(filePath);
  return sumCalibrationValues(lines);
}

function sumCalibrationValues(lines: string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getCalibrationValue(line);
  }
  return sum;
}

/**
 * Returns 0 if there are no digit characters on the line.
 */
function getCalibrationValue(line: string): number {
  const firstDigitChar = searchFirstDigitChar(line);
  if (firstDigitChar === undefined) {
    return 0;
  }
  const lastDigitChar = searchLastDigitChar(line);
  if (lastDigitChar === undefined) {
    return 0;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

function searchFirstDigitChar(line: string): string | undefined {
  for (const char of line) {
    const charIsDigit = checkCharIsDigit(char);
    if (charIsDigit) {
      return char;
    }
  }
  return undefined;
}

function checkCharIsDigit(char: string): boolean {
  return '0' <= char && char <= '9';
}

function searchLastDigitChar(line: string): string | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    const char = line.charAt(i);
    const charIsDigit = checkCharIsDigit(char);
    if (charIsDigit) {
      return char;
    }
  }
  return undefined;
}

function day1Part2(filePath: string): number {
  const lines = readFileLines(filePath);
  return sumPart2CalibrationValues(lines);
}

function sumPart2CalibrationValues(lines: string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getPart2CalibrationValue(line);
  }
  return sum;
}

/**
 * Returns 0 if there are no digit characters on the line.
 */
function getPart2CalibrationValue(line: string): number {
  const firstDigitChar = searchPart2FirstDigitChar(line);
  if (firstDigitChar === undefined) {
    return 0;
  }
  const lastDigitChar = searchPart2LastDigitChar(line);
  if (lastDigitChar === undefined) {
    return 0;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

function searchPart2FirstDigitChar(line: string): string | undefined {
  for (let i = 0; i < line.length; i++) {
    const char = line.charAt(i);
    const charIsDigit = checkCharIsDigit(char);
    if (charIsDigit) {
      return char;
    }
    const digitChar = searchDigitCharAsSpelledDigit(line, i);
    if (digitChar !== undefined) {
      return digitChar;
    }
  }
  return undefined;
}

function searchPart2LastDigitChar(line: string): string | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    const char = line.charAt(i);
    const charIsDigit = checkCharIsDigit(char);
    if (charIsDigit) {
      return char;
    }
    const digitChar = searchDigitCharAsSpelledDigit(line, i);
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
  for (const [spelledDigit, digitChar] of digitCharBySpelledDigit.entries()) {
    if (line.startsWith(spelledDigit, position)) {
      return digitChar;
    }
  }
  return undefined;
}

const part1TestFilePath = process.cwd() + '/src/day1/test-input.txt';
const part2TestFilePath = process.cwd() + '/src/day1/part-two-test-input.txt';
const filePath = process.cwd() + '/src/day1/input.txt';

console.log(`Part 1 test result: ${day1Part1(part1TestFilePath)}`); // 142

console.log(`Part 2 test result: ${day1Part2(part2TestFilePath)}`); // 281

console.log(`Part 1 result: ${day1Part1(filePath)}`); // 54573
console.log(`Part 2 result: ${day1Part2(filePath)}`); // 54591
