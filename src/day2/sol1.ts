import { readFileSync } from 'node:fs';

// const buf = readFileSync(process.cwd() + '/src/day2/test-input.txt'); // 8 2286
const buf = readFileSync(process.cwd() + '/src/day2/input.txt'); // 2476 54911
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
  const config: { [index: string]: number } = {
    red: 12,
    green: 13,
    blue: 14,
  };

  let gameIdsSum = 0;
  for (const line of lines) {
    const [gameID, i] = getGameId(line);
    let gameIsPosible = true;

    const sets = line.substring(i).split(';');
    for (const set of sets) {
      const subsets = set.split(',');
      for (const subset of subsets) {
        const [cubeCount, cubeColor] = subset.trimStart().split(' ');
        if (parseInt(cubeCount) > config[cubeColor]) {
          gameIsPosible = false;
        }
      }
    }

    if (gameIsPosible) {
      gameIdsSum += parseInt(gameID);
    }
  }
  console.log(gameIdsSum);
}

function partTwo(lines: string[]) {
  let powersSum = 0;
  for (const line of lines) {
    const fewest: { [index: string]: number } = {
      red: 0,
      green: 0,
      blue: 0,
    };

    const [_, i] = getGameId(line);
    const sets = line.substring(i).split(';');
    for (const set of sets) {
      const subsets = set.split(',');
      for (const subset of subsets) {
        const [cubeCountStr, cubeColor] = subset.trimStart().split(' ');
        const cubeCount = parseInt(cubeCountStr);
        if (cubeCount > fewest[cubeColor]) {
          fewest[cubeColor] = cubeCount;
        }
      }
    }
    powersSum += fewest.red * fewest.green * fewest.blue;
  }
  console.log(powersSum);
}

function getGameId(line: string): [string, number] {
  let id = line[5];
  let x = 6;
  while (line[x] !== ':') {
    id += line[x];
    x++;
  }
  return [id, x + 1];
}
