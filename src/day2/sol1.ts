import { readFileSync } from 'node:fs';

const config: ReadonlyMap<string, number> = new Map([
  ['red', 12],
  ['green', 13],
  ['blue', 14],
]);

class Game {
  constructor(
    public readonly id: string,
    public readonly ballSets: ReadonlyMap<string, number>[]
  ) {}

  get isPossible(): boolean {
    for (const ballSet of this.ballSets) {
      for (const color of ballSet.keys()) {
        const configBallCount = config.get(color);
        if (configBallCount === undefined) {
          continue;
        }
        if (ballSet.get(color)! > configBallCount) {
          return false;
        }
      }
    }
    return true;
  }

  get minSetPower(): number {
    let power = 1;
    for (const ballCount of this.#minSet.values()) {
      power *= ballCount;
    }
    return power;
  }

  get #minSet(): Map<string, number> {
    const minSet = new Map<string, number>();
    for (const ballSet of this.ballSets) {
      for (const color of ballSet.keys()) {
        minSet.set(
          color,
          Math.max(ballSet.get(color)!, minSet.get(color) ?? 0)
        );
      }
    }
    return minSet;
  }
}

main();

function main() {
  // const inputPath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const inputPath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  const lines: string[] = readFileLines(inputPath);
  const games: Game[] = toGames(lines);

  console.time('partOne');
  const sum: number = sumPossibleGameIds(games);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2: number = sumMinSetPowers(games);
  console.log(sum2);
  console.timeEnd('partTwo');
}

function readFileLines(filePath: string): string[] {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  lines.pop();
  return lines;
}

function toGames(lines: readonly string[]): Game[] {
  const games: Game[] = [];
  for (const line of lines) {
    const [idAsString, ballSetsAsString] = line.split(':');
    const id = idAsString.split(' ')[1];
    const ballSets: ReadonlyMap<string, number>[] = [];
    for (const ballSetAsString of ballSetsAsString.split(';')) {
      const ballSet = new Map<string, number>();
      for (const ballSubsetAsString of ballSetAsString.split(',')) {
        const [ballCountAsString, color] = ballSubsetAsString
          .trimStart()
          .split(' ');
        ballSet.set(color, Number(ballCountAsString));
      }
      ballSets.push(ballSet);
    }
    games.push(new Game(id, ballSets));
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
