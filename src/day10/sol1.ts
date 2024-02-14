import { readFileSync, writeFileSync } from 'fs';

const charConverter = {
  '|': '║',
  '-': '═',
  L: '╚',
  J: '╝',
  '7': '╗',
  F: '╔',
} as const;

main();

function main() {
  // const filePath = process.cwd() + '/src/day10/test-input.txt'; // 8
  const filePath = process.cwd() + '/src/day10/part-two-test-input.txt'; //
  // let filePath = process.cwd() + '/src/day10/input.txt'; // 6682

  const fileStr = readNewFile(filePath);
  // console.log(fileStr);

  const lines = fileStr.split('\n');
  lines.pop();

  console.time('partOne');
  partOne(lines);
  console.timeEnd('partOne');

  // console.time('partTwo');
  // partTwo(histories);
  // console.timeEnd('partTwo');
}

function readNewFile(filePath: string): string {
  const fileName = filePath.split('/').at(-1)!;
  const newFileName = 'new-' + fileName;
  const newFilePath = filePath.slice(0, -fileName.length) + newFileName;

  try {
    return readFileSync(newFilePath, 'utf8');
  } catch {
    const fileStr = readFileSync(filePath, 'utf8');

    let newFileStr = fileStr;
    for (const char in charConverter) {
      newFileStr = newFileStr.replaceAll(
        char,
        charConverter[char as keyof typeof charConverter]
      );
    }
    writeFileSync(newFilePath, newFileStr);
    return newFileStr;
  }
}

function partOne(lines: string[]) {
  const dirs = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  const startPos = getStartPosition(lines)!;

  const prevPos = { x: startPos.x, y: startPos.y };
  const curPos = { x: -1, y: -1 };
  for (const dir of dirs) {
    if (isValidPipe(startPos, dir, lines)) {
      curPos.x = startPos.x + dir.x;
      curPos.y = startPos.y + dir.y;
      break;
    }
  }
  // console.log(curPos, prevPos);

  let step = 1;
  while (curPos.x !== startPos.x || curPos.y !== startPos.y) {
    // console.log(curPos);
    for (const dir of dirs) {
      if (
        isValidPipe(curPos, dir, lines) &&
        (curPos.x + dir.x !== prevPos.x || curPos.y + dir.y !== prevPos.y)
      ) {
        prevPos.x = curPos.x;
        prevPos.y = curPos.y;
        curPos.x = curPos.x + dir.x;
        curPos.y = curPos.y + dir.y;
        break;
      }
    }

    step++;
  }
  console.log(step / 2);
}

function getStartPosition(lines: string[]): { x: number; y: number } {
  let startPosX = 0;
  let startPosY = 0;
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    const pos = line.search('S');
    if (pos !== -1) {
      startPosY = y;
      startPosX = pos;
      return {
        x: startPosX,
        y: startPosY,
      };
    }
  }
  throw new Error('S not found in input file');
}

function isValidPipe(
  position: { x: number; y: number },
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
function partTwo() {}
