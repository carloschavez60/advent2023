import { readFileSync } from 'node:fs';

// const buf = readFileSync(process.cwd() + '/src/day5/test-input.txt'); // 35
const buf = readFileSync(process.cwd() + '/src/day5/input.txt'); // 226172555
const input = buf.toString();
const lines = input.split('\n');

console.time('partOne');
partOne(lines);
console.timeEnd('partOne');

function partOne(lines: string[]) {
  const seeds = getSeeds(lines[0]);
  let aux = [...seeds];
  let sectionLinesNum = 0;
  for (let y = 2; y < lines.length; y++) {
    if (isNumber(lines[y][0])) {
      sectionLinesNum++;
    }
    if (lines[y + 1] === '') {
      for (let i = 0; i < aux.length; i++) {
        const location = aux[i];
        // section
        for (let j = y - sectionLinesNum + 1; j <= y; j++) {
          const [desRanStart, sourRanStart, range] = getRanges(lines[j]);
          if (
            sourRanStart <= location &&
            location <= sourRanStart + range - 1
          ) {
            aux[i] = desRanStart + (location - sourRanStart);
            break;
          }
        }
      }
      sectionLinesNum = 0;
    }
  }
  const lowest = Math.min(...aux);
  console.log(lowest);
}

function getRanges(line: string): [number, number, number] {
  const [desRanStart, sourRanStart, range] = line
    .split(' ')
    .map((str) => parseInt(str));
  return [desRanStart, sourRanStart, range];
}

function getSeeds(line: string): number[] {
  const [_, str] = line.split(':');
  return str
    .split(' ')
    .filter((elem) => elem !== '')
    .map((str) => parseInt(str));
}

function isNumber(char: string): boolean {
  return !isNaN(parseInt(char));
}

function partOneOther(lines: string[]) {
  const seeds = getSeeds(lines[0]);
  let aux = [...seeds];
  let next: number[] = [];
  let wasMuted = [];
  for (let y = 2; y < lines.length; y++) {
    if (isNumber(lines[y][0])) {
      const [desRanStart, sourRanStart, range] = getRanges(lines[y]);
      for (let i = 0; i < aux.length; i++) {
        const location = aux[i];
        if (
          sourRanStart <= location &&
          location <= sourRanStart + range - 1 &&
          !wasMuted[i]
        ) {
          aux[i] = location + desRanStart - sourRanStart;
          wasMuted[i] = true;
        }
      }
    }
    if (lines[y] === '') {
      wasMuted = [];
    }
  }
  const lowest = Math.min(...aux);
  console.log(lowest);
}
