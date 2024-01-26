import { readFileSync } from 'node:fs';

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
  // const filePath = process.cwd() + '/src/day1/part-two-test-input.txt'; // NaN 281
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

function getLines(filePath: string): readonly string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.pop();
  return lines;
}

function partOne(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    let firstDigit = '';
    let lastDigit = '';
    let firstDigitWasCatched = false;

    for (const char of line) {
      if (!isNumber(char)) {
        continue;
      }
      if (!firstDigitWasCatched) {
        firstDigit = char;
        firstDigitWasCatched = true;
      }
      lastDigit = char;
    }
    sum += parseInt(firstDigit + lastDigit);
  }
  return sum;
}

function isNumber(char: string): boolean {
  return !isNaN(parseInt(char));
}

function partTwo(lines: readonly string[]): number {
  let sum = 0;
  for (const line of lines) {
    let firstDigit = 0;
    let lastDigit = 0;
    let firstDigitWasCatched = false;
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (isNumber(char)) {
        if (!firstDigitWasCatched) {
          firstDigit = parseInt(char);
          firstDigitWasCatched = true;
        }
        lastDigit = parseInt(char);
        continue;
      }
      for (const s in stringToNumber) {
        if (line.startsWith(s, x)) {
          const n = stringToNumber[s as keyof typeof stringToNumber];
          if (!firstDigitWasCatched) {
            firstDigit = n;
            firstDigitWasCatched = true;
          }
          lastDigit = n;
        }
      }
    }
    sum += firstDigit * 10 + lastDigit;
  }
  return sum;
}
