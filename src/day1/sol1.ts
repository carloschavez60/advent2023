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

const spelledDigits: readonly string[] = Object.keys(
  Object.fromEntries(spelledDigitToDigit)
);

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

function sumCalibrationValues(lines: string[]): number {
  return lines.reduce((sum, line) => sum + getCalibrationValue(line), 0);
}

function getCalibrationValue(line: string): number {
  let firstDigit: number | undefined;
  let lastDigit: number | undefined;
  let i = 0;
  while (firstDigit === undefined && i < line.length) {
    const digit = Number(line[i]);
    if (!isNaN(digit)) {
      firstDigit = digit;
      lastDigit = digit;
    }
    i++;
  }
  while (i < line.length) {
    const digit = Number(line[i]);
    if (!isNaN(digit)) {
      lastDigit = digit;
    }
    i++;
  }
  if (firstDigit === undefined || lastDigit === undefined) return 0;
  return firstDigit * 10 + lastDigit;
}

function sumCalibrationValues2(lines: string[]): number {
  return lines.reduce((sum, line) => sum + getCalibrationValue2(line), 0);
}

function getCalibrationValue2(line: string): number {
  let firstDigit: number | undefined;
  let lastDigit: number | undefined;
  let i = 0;
  while (firstDigit === undefined && i < line.length) {
    let digit: number | undefined = Number(line[i]);
    if (isNaN(digit)) {
      digit = findDigit(line, i);
    }
    if (digit !== undefined) {
      firstDigit = digit;
      lastDigit = digit;
    }
    i++;
  }
  while (i < line.length) {
    let digit: number | undefined = Number(line[i]);
    if (isNaN(digit)) {
      digit = findDigit(line, i);
    }
    if (digit !== undefined) {
      lastDigit = digit;
    }
    i++;
  }
  if (firstDigit === undefined || lastDigit === undefined) return 0;
  return firstDigit * 10 + lastDigit;
}

function findDigit(searchString: string, position: number): number | undefined {
  const spelledDigit = spelledDigits.find((spelledDigit) =>
    searchString.startsWith(spelledDigit, position)
  );
  if (spelledDigit === undefined) return undefined;
  return spelledDigitToDigit.get(spelledDigit);
}
