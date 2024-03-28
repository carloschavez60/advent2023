import { readFileLines } from '../utils.js';

const digitToNumber: Readonly<{ [digit: string]: number }> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

main();

function main() {
  // const filePath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  // const filePath = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const filePath = process.cwd() + '/src/day1/input.txt'; // 54573 54591
  const lines = readFileLines(filePath);

  console.time('partOne');
  const calibrationValueSum = sumCalibrationValues(lines);
  console.log(calibrationValueSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const calibrationValueSum2 = sumCalibrationValues2(lines);
  console.log(calibrationValueSum2);
  console.timeEnd('partTwo');
}

function sumCalibrationValues(lines: string[]): number {
  return lines.reduce((sum, line) => sum + getCalibrationValue(line), 0);
}

function getCalibrationValue(line: string): number {
  const [firstDigit, lastDigit] = line.split('').reduce(
    ([firstDigit, lastDigit, catched], char) => {
      const n = Number(char);
      return !isNaN(n)
        ? [catched ? firstDigit : n, n, true]
        : [firstDigit, lastDigit, catched];
    },
    [undefined, undefined, false] as [
      number | undefined,
      number | undefined,
      boolean
    ]
  );
  return firstDigit === undefined || lastDigit === undefined
    ? 0
    : firstDigit * 10 + lastDigit;
}

function sumCalibrationValues2(lines: string[]): number {
  return lines.reduce((sum, line) => sum + getCalibrationValue2(line), 0);
}

function getCalibrationValue2(line: string): number {
  const [firstDigit, lastDigit] = line.split('').reduce(
    ([firstDigit, lastDigit, catched], char, x) => {
      const n = findSpelledNumber(x, line) ?? Number(char);
      return !isNaN(n)
        ? [catched ? firstDigit : n, n, true]
        : [firstDigit, lastDigit, catched];
    },
    [undefined, undefined, false] as [
      number | undefined,
      number | undefined,
      boolean
    ]
  );
  return firstDigit === undefined || lastDigit === undefined
    ? 0
    : firstDigit * 10 + lastDigit;
}

function findSpelledNumber(index: number, line: string): number | undefined {
  const key = Object.keys(digitToNumber).find((key) =>
    line.startsWith(key, index)
  );
  return key !== undefined ? digitToNumber[key] : undefined;
}
