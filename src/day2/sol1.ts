import { readFileLinesWithoutLastLine } from '../utils.js';

const config = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

class Game {
  gameID: string;
  sets: { [color: string]: number }[];

  constructor(gameID: string, sets: { [color: string]: number }[]) {
    this.gameID = gameID;
    this.sets = sets;
  }

  isPossible(): boolean {
    for (const set of this.sets) {
      for (const color in set) {
        if (set[color] > config[color as keyof typeof config]) {
          return false;
        }
      }
    }
    return true;
  }

  getMinSetPower(): number {
    const minSet = this.#getMinSet();
    let prod = 1;
    for (const color in minSet) {
      prod *= minSet[color];
    }
    return prod;
  }

  #getMinSet(): { [color: string]: number } {
    const minSet: { [color: string]: number } = {
      red: 0,
      green: 0,
      blue: 0,
    };
    for (const set of this.sets) {
      for (const color in set) {
        minSet[color] = Math.max(minSet[color], set[color]);
      }
    }
    return minSet;
  }
}

main();

function main() {
  // const filePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const filePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  const lines = readFileLinesWithoutLastLine(filePath);
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
        .reduce((subsets: { [color: string]: number }, subsetAsString) => {
          const [cubeCount, cubeColor] = subsetAsString.trimStart().split(' ');
          subsets[cubeColor] = parseInt(cubeCount);
          return subsets;
        }, {});
      return subsets;
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
