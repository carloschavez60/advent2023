import { readFileLines } from '../utils.js';

const config = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

class Game {
  gameId: string;
  sets: { [color: string]: number }[];

  constructor(gameId: string, sets: { [color: string]: number }[]) {
    this.gameId = gameId;
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
  const lines = readFileLines(filePath);
  const games = convertToGames(lines);

  console.time('partOne');
  const gameIdSum = sumPossibleGameIds(games);
  console.log(gameIdSum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const setPowerSum = sumMinSetPowers(games);
  console.log(setPowerSum);
  console.timeEnd('partTwo');
}

function convertToGames(lines: string[]): Game[] {
  const games: Game[] = [];
  for (const line of lines) {
    const [strGameId, strSets] = line.split(':');
    const gameId = strGameId.split(' ')[1];
    const sets: { [color: string]: number }[] = [];
    for (const strSet of strSets.split(';')) {
      const set: { [color: string]: number } = {};
      for (const strSubset of strSet.split(',')) {
        const [strCubeCount, cubeColor] = strSubset.trimStart().split(' ');
        set[cubeColor] = parseInt(strCubeCount);
      }
      sets.push(set);
    }
    games.push(new Game(gameId, sets));
  }
  return games;
}

function sumPossibleGameIds(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible()) {
      sum += parseInt(game.gameId);
    }
  }
  return sum;
}

function sumMinSetPowers(games: Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.getMinSetPower();
  }
  return sum;
}
