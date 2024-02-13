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
  // const inputPath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  // const inputPath = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const inputPath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  const l = readFileLines(inputPath);

  console.time('partOne');
  const s = sumCalibrationValues(l);
  console.log(s);
  console.timeEnd('partOne');

  console.time('partTwo');
  const s2 = sumCalibrationValues2(l);
  console.log(s2);
  console.timeEnd('partTwo');
}

function sumCalibrationValues(lines: string[]): number {
  let sum = 0;
  for (const l of lines) {
    sum += getCalibrationValue(l);
  }
  return sum;
}

function getCalibrationValue(line: string): number {
  let firstDigit: number | undefined;
  let lastDigit: number | undefined;
  let catched = false;
  for (const c of line) {
    const n = Number(c);
    if (!isNaN(n)) {
      lastDigit = n;
      if (!catched) {
        firstDigit = n;
        catched = true;
      }
    }
  }
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function sumCalibrationValues2(lines: string[]): number {
  let sum = 0;
  for (const l of lines) {
    sum += getCalibrationValue2(l);
  }
  return sum;
}

function getCalibrationValue2(line: string): number {
  let firstDigit: number | undefined;
  let lastDigit: number | undefined;
  let catched = false;
  for (let x = 0; x < line.length; x++) {
    const c = line[x];
    let n: number | undefined = Number(c);
    if (isNaN(n)) {
      n = findSpelledNumber(x, line);
    }
    if (n !== undefined) {
      lastDigit = n;
      if (!catched) {
        firstDigit = n;
        catched = true;
      }
    }
  }
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function findSpelledNumber(index: number, line: string): number | undefined {
  for (const s in stringToNumber) {
    if (line.startsWith(s, index)) {
      return stringToNumber[s as keyof typeof stringToNumber];
    }
  }
  return undefined;
}
