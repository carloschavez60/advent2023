import { getLines } from '../utils.js';

main();

function main() {
  // const filePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const filePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  const lines = getLines(filePath);

  console.time('partOne');
  const gameIdSum = partOne(lines);
  console.log(gameIdSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const setPowerSum = partTwo(lines);
  console.log(setPowerSum);
  console.timeEnd('partTwo');
}

function partOne(lines: readonly string[]): number {
  const config = {
    red: 12,
    green: 13,
    blue: 14,
  } as const;

  let gameIdsSum = 0;
  for (const line of lines) {
    const [gameID, i] = getGameId(line);
    let gameIsPosible = true;

    const sets = line.slice(i).split(';');
    for (const set of sets) {
      const subsets = set.split(',');
      for (const subset of subsets) {
        const [cubeCount, cubeColor] = subset.trimStart().split(' ');
        if (parseInt(cubeCount) > config[cubeColor as keyof typeof config]) {
          gameIsPosible = false;
        }
      }
    }

    if (gameIsPosible) {
      gameIdsSum += parseInt(gameID);
    }
  }
  return gameIdsSum;
}

function partTwo(lines: readonly string[]): number {
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
  return powersSum;
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
