import { readFileLines } from '../utils.js';

const stringToNumber = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

main();

function main() {
  // const filePath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  // const filePath = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const filePath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  const lines = readFileLines(filePath);

  console.time('partOne');
  const calibrationValueSum = partOne(lines);
  console.log(calibrationValueSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const calibrationValueSum2 = partTwo(lines);
  console.log(calibrationValueSum2);
  console.timeEnd('partTwo');
}

function partOne(lines: readonly string[]): number {
  return lines.reduce((s, line) => s + getCalibrationValue(line), 0);
}

function getCalibrationValue(line: string): number {
  const digits = line.split('').filter((char) => isNumber(char));
  const firstDigit = digits[0];
  const lastDigit = digits.at(-1);
  if (firstDigit !== undefined && lastDigit !== undefined) {
    return parseInt(firstDigit + lastDigit);
  }
  return 0;
}

function isNumber(char: string): boolean {
  return !isNaN(parseInt(char));
}

function partTwo(lines: readonly string[]): number {
  return lines.reduce((s, line) => s + getCalibrationValuePartTwo(line), 0);
}

function getCalibrationValuePartTwo(line: string): number {
  const digits = line
    .split('')
    .map((char, i) => {
      if (isNumber(char)) {
        return parseInt(char);
      }
      const key = Object.keys(stringToNumber).find((key) =>
        line.startsWith(key, i)
      );
      if (key !== undefined) {
        return stringToNumber[key as keyof typeof stringToNumber];
      }
      return undefined;
    })
    .filter((n) => n !== undefined) as readonly number[];
  const firstDigit = digits[0];
  const lastDigit = digits.at(-1);
  if (firstDigit !== undefined && lastDigit !== undefined) {
    return firstDigit * 10 + lastDigit;
  }
  return 0;
}
