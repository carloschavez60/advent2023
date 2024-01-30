import { getLines } from '../utils.js';

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

  const lines = getLines(filePath);

  console.time('partOne');
  const calibrationValueSum = partOne(lines);
  console.log(calibrationValueSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const calibrationValueSum2 = partTwo(lines);
  console.log(calibrationValueSum2);
  console.timeEnd('partTwo');
}

function partOne(lines: string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getCalibrationValue(line);
  }
  return sum;
}

function getCalibrationValue(line: string): number {
  let firstDigit: number | undefined;
  let lastDigit: number | undefined;
  let firstDigitWasCatched = false;
  for (const char of line) {
    const n = toNumber(char);
    if (n !== undefined) {
      lastDigit = n;
      if (!firstDigitWasCatched) {
        firstDigit = n;
        firstDigitWasCatched = true;
      }
    }
  }
  if (firstDigit !== undefined && lastDigit !== undefined) {
    return firstDigit * 10 + lastDigit;
  }
  return 0;
}

function toNumber(char: string): number | undefined {
  const r = parseInt(char);
  if (!isNaN(r)) {
    return r;
  }
  return undefined;
}

function partTwo(lines: string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += getPartTwoCalibrationValue(line);
  }
  return sum;
}

function getPartTwoCalibrationValue(line: string): number {
  let firstDigit: number | undefined;
  let lastDigit: number | undefined;
  let firstDigitWasCatched = false;
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    const n = toNumber(char) ?? getSpelledNumber(x, line);
    if (n !== undefined) {
      lastDigit = n;
      if (!firstDigitWasCatched) {
        firstDigit = n;
        firstDigitWasCatched = true;
      }
    }
  }
  if (firstDigit !== undefined && lastDigit !== undefined) {
    return firstDigit * 10 + lastDigit;
  }
  return 0;
}

function getSpelledNumber(index: number, line: string): number | undefined {
  for (const s in stringToNumber) {
    if (line.startsWith(s, index)) {
      return stringToNumber[s as keyof typeof stringToNumber];
    }
  }
  return undefined;
}
