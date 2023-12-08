import { readFileSync } from 'node:fs';

// const buf = readFileSync(process.cwd() + '/src/day1/test-input.txt'); // 142 142
// const buf = readFileSync(process.cwd() + '/src/day1/test-input-part-two.txt'); // NaN 281
const buf = readFileSync(process.cwd() + '/src/day1/input.txt'); // 54573 54591
const input = buf.toString();
const lines = input.split('\n');
lines.pop();

console.time('partOne');
partOne(lines);
console.timeEnd('partOne');
console.time('partTwo');
partTwo(lines);
console.timeEnd('partTwo');

function partOne(lines: string[]) {
  let sum = 0;
  for (const line of lines) {
    let firstDigit = '';
    let lastDigit = '';
    let firstDigitWasCatched = false;

    for (const char of line) {
      if (isNumber(char)) {
        if (!firstDigitWasCatched) {
          firstDigit = char;
          firstDigitWasCatched = true;
        }
        lastDigit = char;
      }
    }

    sum += parseInt(firstDigit + lastDigit);
  }
  console.log(sum);
}

function partTwo(lines: string[]) {
  const numStrings = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];
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
      } else {
        for (let i = 0; i < numStrings.length; i++) {
          if (line.startsWith(numStrings[i], x)) {
            if (!firstDigitWasCatched) {
              firstDigit = i + 1;
              firstDigitWasCatched = true;
            }
            lastDigit = i + 1;
          }
        }
      }
    }

    sum += firstDigit * 10 + lastDigit;
  }
  console.log(sum);
}

function isNumber(char: string): boolean {
  return !isNaN(parseInt(char));
}
