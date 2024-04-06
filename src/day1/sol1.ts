import { readFileLines } from '../utils.js';

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
  // const inputPath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  // const inputPath = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const inputPath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  const lines = readFileLines(inputPath);

  console.time('partOne');
  const sum = sumCalibrationValues(lines);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2 = sumCalibrationValues2(lines);
  console.log(sum2);
  console.timeEnd('partTwo');
}

function sumCalibrationValues(lines: readonly string[]): number {
  return lines.reduce((sum, line) => sum + toCalibrationValue(line), 0);
}

function toCalibrationValue(line: string): number {
  let firstDigit: number | undefined;
  for (const char of line) {
    const digit = Number(char);
    if (!isNaN(digit)) {
      firstDigit = digit;
      break;
    }
  }
  let lastDigit: number | undefined;
  for (let i = line.length - 1; i >= 0; i--) {
    const digit = Number(line[i]);
    if (!isNaN(digit)) {
      lastDigit = digit;
      break;
    }
  }
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function sumCalibrationValues2(lines: readonly string[]): number {
  return lines.reduce((sum, line) => sum + toCalibrationValue2(line), 0);
}

function toCalibrationValue2(line: string): number {
  let firstDigit: number | undefined;
  for (let i = 0; i < line.length; i++) {
    let digit: number | undefined = Number(line[i]);
    if (isNaN(digit)) {
      digit = findDigit(line, i);
    }
    if (digit !== undefined) {
      firstDigit = digit;
      break;
    }
  }
  let lastDigit: number | undefined;
  for (let i = line.length - 1; i >= 0; i--) {
    let digit: number | undefined = Number(line[i]);
    if (isNaN(digit)) {
      digit = findDigit(line, i);
    }
    if (digit !== undefined) {
      lastDigit = digit;
      break;
    }
  }
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function findDigit(searchString: string, position: number): number | undefined {
  for (const spelledDigit of spelledDigitToDigit.keys()) {
    if (searchString.startsWith(spelledDigit, position)) {
      return spelledDigitToDigit.get(spelledDigit);
    }
  }
  return undefined;
}
