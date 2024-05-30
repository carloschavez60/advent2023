import { readFileSync } from 'node:fs';

const spelledDigitToDigitChar: ReadonlyMap<string, string> = new Map([
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

main();

function main() {
  const testFilePath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  const testFile2Path = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const filePath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  day1(testFilePath);
  day1(testFile2Path);
  day1(filePath);
}

function day1(filePath: string) {
  console.time('day1');

  const lines: string[] = readFileLines(filePath);

  const part1Result: number = sumCalibrationValues(lines);
  console.log('part 1 result: ', part1Result);

  const part2Result: number = sumPart2CalibrationValues(lines);
  console.log('part 2 result: ', part2Result);

  console.timeEnd('day1');
}

function readFileLines(path: string): string[] {
  const lines: string[] = readFileSync(path, 'utf8').split('\n');
  if (lines.at(-1) === '') {
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
  const firstDigitChar: string | undefined = findFirstDigitCharIn(line);
  if (firstDigitChar === undefined) {
    return 0;
  }
  const lastDigitChar: string | undefined = findLastDigitCharIn(line);
  if (lastDigitChar === undefined) {
    return 0;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

function findFirstDigitCharIn(line: string): string | undefined {
  for (let i = 0; i < line.length; i++) {
    const char: string = line[i];
    if (isDigit(char)) {
      return char;
    }
  }
  return undefined;
}

function isDigit(char: string): boolean {
  return '0' <= char && char <= '9';
}

function findLastDigitCharIn(line: string): string | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    const char: string = line[i];
    if (isDigit(char)) {
      return char;
    }
  }
  return undefined;
}

function sumPart2CalibrationValues(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getPart2CalibrationValue(line);
  }
  return sum;
}

function getPart2CalibrationValue(line: string): number {
  const firstDigitChar: string | undefined = findPart2FirstDigitIn(line);
  if (firstDigitChar === undefined) {
    return 0;
  }
  const lastDigitChar: string | undefined = findPart2LastDigitIn(line);
  if (lastDigitChar === undefined) {
    return 0;
  }
  return parseInt(firstDigitChar + lastDigitChar);
}

function findPart2FirstDigitIn(line: string): string | undefined {
  for (let i = 0; i < line.length; i++) {
    const char: string = line[i];
    if (isDigit(char)) {
      return char;
    }
    const digitChar: string | undefined = findCharDigitIn(line, i);
    if (digitChar !== undefined) {
      return digitChar;
    }
  }
  return undefined;
}

function findPart2LastDigitIn(line: string): string | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    const char: string = line[i];
    if (isDigit(char)) {
      return char;
    }
    const digitChar: string | undefined = findCharDigitIn(line, i);
    if (digitChar !== undefined) {
      return digitChar;
    }
  }
  return undefined;
}

function findCharDigitIn(line: string, position: number): string | undefined {
  for (const [spelledDigit, digitChar] of spelledDigitToDigitChar.entries()) {
    if (line.startsWith(spelledDigit, position)) {
      return digitChar;
    }
  }
  return undefined;
}
