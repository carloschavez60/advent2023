import { readFileLines } from '../utils.js';
import _ from 'lodash';

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
  // const filePath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  // const filePath = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const filePath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  const lines = readFileLines(filePath);

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
  return lines.reduce((sum, line) => sum + getCalibrationValue(line), 0);
}

function getCalibrationValue(line: string): number {
  const wrapped = _.chain(line)
    .map((char) => Number(char))
    .filter((digit) => !isNaN(digit));
  const firstDigit = wrapped.next().value;
  const lastDigit = wrapped.last().value();
  return firstDigit !== undefined && lastDigit !== undefined
    ? firstDigit * 10 + lastDigit
    : 0;
}

function sumCalibrationValues2(lines: readonly string[]): number {
  return lines.reduce((sum, line) => sum + getCalibrationValue2(line), 0);
}

function getCalibrationValue2(line: string): number {
  const wrapped = _.chain(line)
    .map((char, i) => {
      const digit: number | undefined = Number(char);
      if (!isNaN(digit)) return digit;
      const altDigit = findDigit(line, i);
      if (altDigit !== undefined) return altDigit;
      return undefined;
    })
    .filter((n) => n !== undefined);
  const firstDigit = wrapped.next().value;
  const lastDigit = wrapped.last().value();
  return firstDigit !== undefined && lastDigit !== undefined
    ? firstDigit * 10 + lastDigit
    : 0;
}

function findDigit(searchString: string, position: number): number | undefined {
  const spelledDigit = spelledDigits.find((spelledDigit) =>
    searchString.startsWith(spelledDigit, position)
  );
  return spelledDigit !== undefined
    ? spelledDigitToDigit.get(spelledDigit)
    : undefined;
}
