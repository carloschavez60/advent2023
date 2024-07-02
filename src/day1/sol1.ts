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

/**
 * Every line of the file must have at least one digit character.
 */
function day1Part1(filePath: string) {
  const lines = readFileLines(filePath);

  const part1Result = sumCalibrationValues(lines);
  console.log('part 1 result:', part1Result);
}

function readFileLines(filePath: string): string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function sumCalibrationValues(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getCalibrationValue(line);
  }
  return sum;
}

function getCalibrationValue(line: string): number {
  const [firstDigitChar, firstDigitCharIndex] = getFirstDigitChar(line);
  let lastDigitChar = getLastDigitChar(line, firstDigitCharIndex);
  if (lastDigitChar === undefined) {
    lastDigitChar = firstDigitChar;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

/**
 * @returns [firstDigitChar, firstDigitCharIndex]
 */
function getFirstDigitChar(line: string): [string, number] {
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (isDigit(char)) {
      return [char, i];
    }
  }
  throw new Error('Panic: Line must have at least one digit character.');
}

function isDigit(char: string): boolean {
  return '0' <= char && char <= '9';
}

/**
 * Returns undefined if the last digit is the same as the first digit.
 */
function getLastDigitChar(
  line: string,
  firstDigitCharIndex: number
): string | undefined {
  for (let i = line.length - 1; i > firstDigitCharIndex; i--) {
    const char = line[i];
    if (isDigit(char)) {
      return char;
    }
  }
  return undefined;
}

/**
 * Every line of the file must have at least
 * one digit character or spelled digit.
 */
function day1Part2(filePath: string) {
  const lines = readFileLines(filePath);

  const part2Result = sumPart2CalibrationValues(lines);
  console.log('part 2 result:', part2Result);
}

function sumPart2CalibrationValues(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getPart2CalibrationValue(line);
  }
  return sum;
}

function getPart2CalibrationValue(line: string): number {
  const [firstDigitChar, firstDigitCharIndex] = getPart2FirstDigitChar(line);
  let lastDigitChar = getPart2LastDigitChar(line, firstDigitCharIndex);
  if (lastDigitChar === undefined) {
    lastDigitChar = firstDigitChar;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

/**
 * @returns [firstDigitChar, firstDigitCharIndex]
 */
function getPart2FirstDigitChar(line: string): [string, number] {
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (isDigit(char)) {
      return [char, i];
    }
    const digitChar = searchSpelledDigitAndParse(line, i);
    if (digitChar !== undefined) {
      return [digitChar, i];
    }
  }
  throw new Error(
    'Panic: Line must have at least one digit character or spelled digit.'
  );
}

/**
 * Returns undefined if the last digit is the same as the first digit.
 */
function getPart2LastDigitChar(
  line: string,
  firstDigitCharIndex: number
): string | undefined {
  for (let i = line.length - 1; i > firstDigitCharIndex; i--) {
    const char = line[i];
    if (isDigit(char)) {
      return char;
    }
    const digitChar = searchSpelledDigitAndParse(line, i);
    if (digitChar !== undefined) {
      return digitChar;
    }
  }
  return undefined;
}

/**
 * @returns digitChar
 */
function searchSpelledDigitAndParse(
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

const testFilePath = process.cwd() + '/src/day1/test-input.txt';
const testFile2Path = process.cwd() + '/src/day1/part-two-test-input.txt';
const filePath = process.cwd() + '/src/day1/input.txt';

day1Part1(testFilePath); // 142
day1Part2(testFile2Path); // 281

day1Part1(filePath); // 54573
day1Part2(filePath); // 54591
