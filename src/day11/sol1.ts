import { readFileSync } from 'fs';

class Galaxy {
  readonly id: number;
  readonly x: number;
  readonly y: number;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  getShortestPathTo(galaxy: Galaxy): number {
    return Math.abs(this.x - galaxy.x) + Math.abs(this.y - galaxy.y);
  }
}

// const filePath = process.cwd() + '/src/day11/test-input.txt';
const filePath = process.cwd() + '/src/day11/input.txt'; // 9536038 447744640566

const lines = getFileLines(filePath);

console.time('partOne');
partOne(lines);
console.timeEnd('partOne');

console.time('partTwo');
partTwo(lines);
console.timeEnd('partTwo');

function getFileLines(filePath: string): readonly string[] {
  const fileAsString = readFileSync(filePath, 'utf8');
  const lines = fileAsString.split('\n');
  lines.pop();
  return lines;
}

function partOne(lines: readonly string[]) {
  const expandedLines = expandLines(lines);
  const galaxies = getGalaxies(expandedLines);
  const shortestPathSum = getShortestPathSum(galaxies);
  console.log(shortestPathSum);
}

function expandLines(lines: readonly string[]): readonly string[] {
  // expand rows
  const expandedLines = [...lines];
  for (let y = 0; y < expandedLines.length; y++) {
    const line = expandedLines[y];
    const emptyLine = ''.padStart(line.length, '.');

    if (line === emptyLine) {
      expandedLines.splice(y, 0, emptyLine);
      y++;
    }
  }
  //expand columns
  for (let x = 0; x < expandedLines[0].length; x++) {
    let colContainsNoGalaxies = true;
    for (let y = 0; y < expandedLines.length; y++) {
      if (expandedLines[y][x] === '#') {
        colContainsNoGalaxies = false;
      }
    }

    if (colContainsNoGalaxies) {
      for (let y = 0; y < expandedLines.length; y++) {
        expandedLines[y] =
          expandedLines[y].slice(0, x + 1) +
          '.' +
          expandedLines[y].slice(x + 1);
      }
      x++;
    }
  }
  return expandedLines;
}

function getGalaxies(lines: readonly string[]): readonly Galaxy[] {
  const galaxies: Galaxy[] = [];
  let n = 1;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      if (lines[y][x] === '#') {
        galaxies.push(new Galaxy(n, x, y));
        n++;
      }
    }
  }
  return galaxies;
}

function getShortestPathSum(galaxies: readonly Galaxy[]): number {
  let sum = 0;
  for (let i = 0; i < galaxies.length - 1; i++) {
    const galaxyI = galaxies[i];
    for (let j = i + 1; j < galaxies.length; j++) {
      const galaxyJ = galaxies[j];
      const shortestPath = galaxyI.getShortestPathTo(galaxyJ);
      sum += shortestPath;
    }
  }
  return sum;
}

function partTwo(lines: readonly string[]) {
  const expansionCoefficient = 1000000;

  const galaxies = getGalaxies(lines);
  const expandedGalaxies = getExpandedGalaxies(
    expansionCoefficient,
    galaxies,
    lines
  );
  const shortestPathSum = getShortestPathSum(expandedGalaxies);
  console.log(shortestPathSum);
}

function getExpandedGalaxies(
  expansionCoefficient: number,
  galaxies: readonly Galaxy[],
  lines: readonly string[]
): readonly Galaxy[] {
  const expandedGalaxies: Galaxy[] = [...galaxies];

  // expand rows
  const arr: number[] = [];
  for (let j = 0; j < galaxies.length; j++) {
    arr[j] = 0;
  }

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    const emptyLine = ''.padStart(line.length, '.');

    if (line === emptyLine) {
      for (let j = 0; j < expandedGalaxies.length; j++) {
        const galaxy = expandedGalaxies[j];
        if (galaxy.y > y) {
          arr[j]++;
        }
      }
    }
  }

  for (let j = 0; j < expandedGalaxies.length; j++) {
    const galaxy = expandedGalaxies[j];
    expandedGalaxies[j] = new Galaxy(
      galaxy.id,
      galaxy.x,
      galaxy.y + (expansionCoefficient - 1) * arr[j]
    );
  }

  //expand columns
  for (let j = 0; j < galaxies.length; j++) {
    arr[j] = 0;
  }

  for (let x = 0; x < lines[0].length; x++) {
    let colContainsNoGalaxies = true;
    for (let y = 0; y < lines.length; y++) {
      if (lines[y][x] === '#') {
        colContainsNoGalaxies = false;
      }
    }

    if (colContainsNoGalaxies) {
      for (let j = 0; j < expandedGalaxies.length; j++) {
        const galaxy = expandedGalaxies[j];
        if (galaxy.x > x) {
          arr[j]++;
        }
      }
    }
  }

  for (let j = 0; j < expandedGalaxies.length; j++) {
    const galaxy = expandedGalaxies[j];
    expandedGalaxies[j] = new Galaxy(
      galaxy.id,
      galaxy.x + (expansionCoefficient - 1) * arr[j],
      galaxy.y
    );
  }

  return expandedGalaxies;
}
