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
  // const inputFilePath = process.cwd() + '/src/day1/test-input.txt'; // 142 142
  // const inputFilePath = process.cwd() + '/src/day1/part-two-test-input.txt'; // 209 281
  const inputFilePath = process.cwd() + '/src/day1/input.txt'; // 54573 54591

  console.time('partOne');
  const lines: string[] = readInputFileLines(inputFilePath);

  const sum: number = sumCalibrationValues(lines);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2: number = sumCalibrationValues2(lines);
  console.log(sum2);
  console.timeEnd('partTwo');
}

function readInputFileLines(inputFilePath: string): string[] {
  const lines = readFileSync(inputFilePath, 'utf8').split('\n');
  lines.pop();
  return lines;
}

function sumCalibrationValues(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += toCalibrationValue(line);
  }
  return sum;
}

function toCalibrationValue(line: string): number {
  let firstDigit: number | undefined;
  for (let i = 0; i < line.length; i++) {
    firstDigit = Number(line[i]);
    if (!isNaN(firstDigit)) {
      break;
    }
  }
  let lastDigit: number | undefined;
  for (let i = line.length - 1; i >= 0; i--) {
    lastDigit = Number(line[i]);
    if (!isNaN(lastDigit)) {
      break;
    }
  }
  if (firstDigit === undefined || lastDigit === undefined) {
    return 0;
  }
  return firstDigit * 10 + lastDigit;
}

function sumCalibrationValues2(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    sum += toCalibrationValue2(line);
  }
  return sum;
}

function toCalibrationValue2(line: string): number {
  let firstDigit: number | undefined;
  for (let i = 0; i < line.length; i++) {
    firstDigit = Number(line[i]);
    if (isNaN(firstDigit)) {
      firstDigit = findDigit(line, i);
    }
    if (firstDigit !== undefined) {
      break;
    }
  }
  let lastDigit: number | undefined;
  for (let i = line.length - 1; i >= 0; i--) {
    lastDigit = Number(line[i]);
    if (isNaN(lastDigit)) {
      lastDigit = findDigit(line, i);
    }
    if (lastDigit !== undefined) {
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
      return spelledDigitToDigit.get(spelledDigit)!;
    }
  }
  return undefined;
}
