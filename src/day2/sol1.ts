import { getLines } from '../utils.js';

const config = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

class Game {
  constructor(public gameID: string, public sets: CubeSet[]) {}

  isPossible(): boolean {
    let is = true;
    for (const set of this.sets) {
      if (
        set.red > config.red ||
        set.green > config.green ||
        set.blue > config.blue
      ) {
        is = false;
        break;
      }
    }
    return is;
  }

  getMinSetPower(): number {
    const minSet = this.#getMinSet();
    return minSet.red * minSet.green * minSet.blue;
  }

  #getMinSet(): CubeSet {
    const minSet = this.sets[0];
    for (let i = 1; i < this.sets.length; i++) {
      const set = this.sets[i];
      minSet.red = Math.max(set.red, minSet.red);
      minSet.green = Math.max(set.green, minSet.green);
      minSet.blue = Math.max(set.blue, minSet.blue);
    }
    return minSet;
  }
}

class CubeSet {
  constructor(public red: number, public green: number, public blue: number) {}
}

main();

function main() {
  const filePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  // const filePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  const lines = getLines(filePath);
  const games = getGames(lines);

  console.time('partOne');
  const gameIdSum = partOne(games);
  console.log(gameIdSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const setPowerSum = partTwo(games);
  console.log(setPowerSum);
  console.timeEnd('partTwo');
}

function getGames(lines: string[]): Game[] {
  return lines.map((line) => {
    const [game, setsAsString] = line.split(':');
    const gameID = game.split(' ')[1];
    const sets = setsAsString.split(';').map((setAsString) => {
      const subsets = setAsString
        .split(',')
        .reduce((acc: { [color: string]: number }, subsetAsString) => {
          const [cubeCount, cubeColor] = subsetAsString.trimStart().split(' ');
          acc[cubeColor] = parseInt(cubeCount);
          return acc;
        }, {});
      return new CubeSet(
        subsets.red ?? 0,
        subsets.green ?? 0,
        subsets.blue ?? 0
      );
    });
    return new Game(gameID, sets);
  });
}

function partOne(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible()) {
      sum += parseInt(game.gameID);
    }
  }
  return sum;
}

function partTwo(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.getMinSetPower();
  }
  return sum;
}
