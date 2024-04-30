import { readFileSync } from 'node:fs';

const spelledDigitToDigit: ReadonlyMap<string, number> = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

main();

function main() {
  const testFilePath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  const testFilePath2 = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const filePath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  day1(testFilePath);
  day1(testFilePath2);
  day1(filePath);
}

function day1(filePath: string) {
  const lines = readFileLines(filePath);
  part1(lines);
  part2(lines);
}

function readFileLines(path: string): string[] {
  const lines = readFileSync(path, 'utf8').split('\n');
  lines.pop();
  return lines;
}

function part1(lines: readonly string[]) {
  console.time('partOne');
  const sum = sumCalibrationValues(lines);
  console.log(sum);
  console.timeEnd('partOne');
}

function sumCalibrationValues(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getCalibrationValue(line);
  }
  return sum;
}

function getCalibrationValue(line: string): number {
  const firstDigit = findFirstDigit(line);
  const lastDigit = findLastDigit(line);
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function findFirstDigit(line: string): number | undefined {
  for (let i = 0; i < line.length; i++) {
    const digit = parseInt(line[i]);
    if (!isNaN(digit)) {
      return digit;
    }
  }
  return undefined;
}

function findLastDigit(line: string): number | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    const digit = parseInt(line[i]);
    if (!isNaN(digit)) {
      return digit;
    }
  }
  return undefined;
}

function part2(lines: readonly string[]) {
  console.time('partTwo');
  const sum: number = sumPart2CalibrationValues(lines);
  console.log(sum);
  console.timeEnd('partTwo');
}

function sumPart2CalibrationValues(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getPart2CalibrationValue(line);
  }
  return sum;
}

function getPart2CalibrationValue(line: string): number {
  const firstDigit = findPart2FirstDigit(line);
  const lastDigit = findPart2LastDigit(line);
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function findPart2FirstDigit(line: string): number | undefined {
  for (let i = 0; i < line.length; i++) {
    let digit: number | undefined = parseInt(line[i]);
    if (isNaN(digit)) {
      digit = findParsedSpelledDigit(line, i);
    }
    if (digit !== undefined) {
      return digit;
    }
  }
  return undefined;
}

function findPart2LastDigit(line: string): number | undefined {
  for (let i = line.length - 1; i >= 0; i--) {
    let digit: number | undefined = parseInt(line[i]);
    if (isNaN(digit)) {
      digit = findParsedSpelledDigit(line, i);
    }
    if (digit !== undefined) {
      return digit;
    }
  }
  return undefined;
}

function findParsedSpelledDigit(
  line: string,
  position: number
): number | undefined {
  for (const spelledDigit of spelledDigitToDigit.keys()) {
    if (line.startsWith(spelledDigit, position)) {
      return spelledDigitToDigit.get(spelledDigit)!;
    }
  }
  return undefined;
}
