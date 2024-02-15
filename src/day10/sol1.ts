import { readFileSync, writeFileSync } from 'fs';

const charConverter = {
  '|': '║',
  '-': '═',
  L: '╚',
  J: '╝',
  '7': '╗',
  F: '╔',
} as const;

const dirs = [
  { x: 0, y: -1 },
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
] as const;

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqualTo(p: Point): boolean {
    if (this.x === p.x && this.y === p.y) {
      return true;
    }
    return false;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day10/test-input.txt'; // 8
  // const inputPath = process.cwd() + '/src/day10/part-two-test-input.txt'; // 80
  let inputPath = process.cwd() + '/src/day10/input.txt'; // 6682

  const l = readNewFileLines(inputPath);

  console.time('partOne');
  const c = countStepsToFarthestPoint(l);
  console.log(c);
  console.timeEnd('partOne');

  // console.time('partTwo');
  // console.timeEnd('partTwo');
}

function readNewFileLines(filePath: string): string[] {
  const fileName = filePath.split('/').at(-1)!;
  const newFileName = 'new-' + fileName;
  const newFilePath = filePath.slice(0, -fileName.length) + newFileName;

  try {
    const lines = readFileSync(newFilePath, 'utf8').split('\n');
    lines.pop();
    return lines;
  } catch {
    let newStrFile = readFileSync(filePath, 'utf8');
    for (const char in charConverter) {
      newStrFile = newStrFile.replaceAll(
        char,
        charConverter[char as keyof typeof charConverter]
      );
    }
    writeFileSync(newFilePath, newStrFile);
    const lines = newStrFile.split('\n');
    lines.pop();
    return lines;
  }
}

function countStepsToFarthestPoint(lines: string[]): number {
  const startPos = getStartPosition(lines);
  let prevPos = startPos;
  let curPos = getNextPosition(startPos, prevPos, lines);
  let step = 1;
  while (!curPos.isEqualTo(startPos)) {
    step++;
    const nextPos = getNextPosition(curPos, prevPos, lines);
    prevPos = curPos;
    curPos = nextPos;
  }
  return step / 2;
}

function getStartPosition(lines: string[]): Point {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === 'S') {
        return new Point(x, y);
      }
    }
  }
  throw new Error('S not found in input file');
}

function getNextPosition(cur: Point, prev: Point, lines: string[]): Point {
  for (const d of dirs) {
    const nextPos = new Point(cur.x + d.x, cur.y + d.y);
    if (isValidPipe(cur, d, lines) && !nextPos.isEqualTo(prev)) {
      return nextPos;
    }
  }
  throw new Error('There is not a loop in the input file');
}

function isValidPipe(
  position: Point,
  direction: { x: number; y: number },
  lines: string[]
): boolean {
  const line = lines[position.y + direction.y];
  if (line === undefined) {
    return false;
  }
  const nextChar = line[position.x + direction.x];
  if (nextChar === undefined) {
    return false;
  }
  const curChar = lines[position.y][position.x];
  if (
    direction.x === 0 &&
    direction.y === -1 &&
    (nextChar === '║' ||
      nextChar === '╔' ||
      nextChar === '╗' ||
      nextChar === 'S') &&
    (curChar === '║' || curChar === '╝' || curChar === '╚' || curChar === 'S')
  ) {
    return true;
  }
  if (
    direction.x === 1 &&
    direction.y === 0 &&
    (nextChar === '═' ||
      nextChar === '╝' ||
      nextChar === '╗' ||
      nextChar === 'S') &&
    (curChar === '═' || curChar === '╚' || curChar === '╔' || curChar === 'S')
  ) {
    return true;
  }
  if (
    direction.x === 0 &&
    direction.y === 1 &&
    (nextChar === '║' ||
      nextChar === '╝' ||
      nextChar === '╚' ||
      nextChar === 'S') &&
    (curChar === '║' || curChar === '╔' || curChar === '╗' || curChar === 'S')
  ) {
    return true;
  }
  if (
    direction.x === -1 &&
    direction.y === 0 &&
    (nextChar === '═' ||
      nextChar === '╚' ||
      nextChar === '╔' ||
      nextChar === 'S') &&
    (curChar === '═' || curChar === '╝' || curChar === '╗' || curChar === 'S')
  ) {
    return true;
  }
  return false;
}

function countEnclosedTiles() {}
