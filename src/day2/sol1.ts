import { readFileLines } from '../utils.js';

const config: ReadonlyMap<string, number> = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

class Game {
  constructor(
    public readonly id: string,
    public readonly sets: ReadonlyMap<string, number>[]
  ) {}

  get isPossible(): boolean {
    for (const set of this.sets) {
      for (const color of set.keys()) {
        if (set.get(color)! > config.get(color)!) {
          return false;
        }
      }
    }
    return true;
  }

  get minSetPower(): number {
    const minSet = this.#minSet;
    let prod = 1;
    for (const color of minSet.keys()) {
      prod *= minSet.get(color)!;
    }
    return prod;
  }

  get #minSet(): ReadonlyMap<string, number> {
    const minSet = new Map<string, number>([
      ['red', 0],
      ['green', 0],
      ['blue', 0],
    ]);
    for (const set of this.sets) {
      for (const color of set.keys()) {
        minSet.set(color, Math.max(minSet.get(color)!, set.get(color)!));
      }
    }
    return minSet;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const inputPath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  const lines = readFileLines(inputPath);
  const games = toGames(lines);

  console.time('partOne');
  const sum = sumPossibleGameIds(games);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2 = sumMinSetPowers(games);
  console.log(sum2);
  console.timeEnd('partTwo');
}

function toGames(lines: readonly string[]): readonly Game[] {
  const games: Game[] = [];
  for (const line of lines) {
    const [strId, strSets] = line.split(':');
    const id = strId.split(' ')[1];
    const sets: ReadonlyMap<string, number>[] = [];
    for (const strSet of strSets.split(';')) {
      const set = new Map<string, number>();
      for (const strSubset of strSet.split(',')) {
        const [strBallCount, color] = strSubset.trimStart().split(' ');
        set.set(color, Number(strBallCount));
      }
      sets.push(set);
    }
    games.push(new Game(id, sets));
  }
  return games;
}

function sumPossibleGameIds(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible) {
      sum += Number(game.id);
    }
  }
  return sum;
}

function sumMinSetPowers(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.minSetPower;
  }
  return sum;
}
