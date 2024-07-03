import { readFileSync } from 'node:fs';

class Galaxy {
  id: number;
  x: number;
  y: number;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  getShortestPathTo(galaxy: Galaxy): number {
    return Math.abs(this.x - galaxy.x) + Math.abs(this.y - galaxy.y);
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day11/test-input.txt'; // 374 82000210
  const inputPath = process.cwd() + '/src/day11/input.txt'; // 9536038 447744640566

  const l = readFileLines(inputPath);

  console.time('partOne');
  const s = getShortestPathsSum(l);
  console.log(s);
  console.timeEnd('partOne');

  const expansion = 1_000_000;

  console.time('partTwo');
  const s2 = getShortestPathsSum2(l, expansion);
  console.log(s2);
  console.timeEnd('partTwo');
}

function readFileLines(filePath: string): string[] {
  const lines: string[] = readFileSync(filePath, 'utf8').split('\n');
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

function getShortestPathsSum(lines: string[]): number {
  const el = expandLines(lines);
  const g = toGalaxies(el);
  const sum = sumGalaxyShortestPaths(g);
  return sum;
}

function expandLines(lines: string[]): string[] {
  const l = [...lines];
  //expand columns
  for (let x = 0; x < l[0].length; x++) {
    let colContainsNoGalaxies = true;
    for (let y = 0; y < l.length; y++) {
      if (l[y][x] === '#') {
        colContainsNoGalaxies = false;
        break;
      }
    }
    if (colContainsNoGalaxies) {
      for (let y = 0; y < l.length; y++) {
        l[y] = l[y].slice(0, x) + '.' + l[y].slice(x);
      }
      x++;
    }
  }
  // expand rows
  for (let y = 0; y < l.length; y++) {
    const emptyLine = ''.padStart(l[y].length, '.');
    if (l[y] === emptyLine) {
      l.splice(y, 0, emptyLine);
      y++;
    }
  }
  return l;
}

function toGalaxies(lines: string[]): Galaxy[] {
  const galaxies: Galaxy[] = [];
  let n = 1;
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (lines[y][x] === '#') {
        galaxies.push(new Galaxy(n, x, y));
        n++;
      }
    }
  }
  return galaxies;
}

function sumGalaxyShortestPaths(galaxies: Galaxy[]): number {
  let sum = 0;
  for (let i = 0; i < galaxies.length - 1; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      sum += galaxies[i].getShortestPathTo(galaxies[j]);
    }
  }
  return sum;
}

function getShortestPathsSum2(lines: string[], expansion: number): number {
  const g = toGalaxies(lines);
  const eg = expandGalaxies(g, expansion, lines);
  const sum = sumGalaxyShortestPaths(eg);
  return sum;
}

function expandGalaxies(
  galaxies: Galaxy[],
  expansion: number,
  lines: string[]
): Galaxy[] {
  const rm = getRowMultipliers(galaxies, lines);
  const cm = getColMultipliers(galaxies, lines);
  const eg = [...galaxies];
  for (let i = 0; i < eg.length; i++) {
    const g = eg[i];
    g.x += (expansion - 1) * cm[i];
    g.y += (expansion - 1) * rm[i];
  }
  return eg;
}

function getRowMultipliers(galaxies: Galaxy[], lines: string[]): number[] {
  const rm: number[] = new Array(galaxies.length).fill(0);
  for (let y = 0; y < lines.length; y++) {
    const l = lines[y];
    const empty = ''.padStart(l.length, '.');
    if (l === empty) {
      for (let i = 0; i < galaxies.length; i++) {
        const g = galaxies[i];
        if (g.y > y) {
          rm[i]++;
        }
      }
    }
  }
  return rm;
}

function getColMultipliers(galaxies: Galaxy[], lines: string[]): number[] {
  const cm: number[] = new Array(galaxies.length).fill(0);
  for (let x = 0; x < lines[0].length; x++) {
    let colContainsNoGalaxies = true;
    for (let y = 0; y < lines.length; y++) {
      if (lines[y][x] === '#') {
        colContainsNoGalaxies = false;
        break;
      }
    }
    if (colContainsNoGalaxies) {
      for (let i = 0; i < galaxies.length; i++) {
        const g = galaxies[i];
        if (g.x > x) {
          cm[i]++;
        }
      }
    }
  }
  return cm;
}
