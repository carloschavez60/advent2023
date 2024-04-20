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

  isPossible(): boolean {
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

  minBallSetPower(): number {
    let power = 1;
    for (const ballCount of this.#minBallSet().values()) {
      power *= ballCount;
    }
    return power;
  }

  #minBallSet(): Map<string, number> {
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
  // const inputFilePath = process.cwd() + '/src/day2/test-input.txt'; // 8 2286
  const inputFilePath = process.cwd() + '/src/day2/input.txt'; // 2476 54911

  console.time('partOne');
  const games: Game[] = readGames(inputFilePath);

  const sum: number = sumPossibleGameIds(games);
  console.log(sum);
  console.timeEnd('partOne');

  console.time('partTwo');
  const sum2: number = sumMinBallSetPowers(games);
  console.log(sum2);
  console.timeEnd('partTwo');
}

function readGames(inputFilePath: string): Game[] {
  const lines: string[] = readInputFileLines(inputFilePath);
  const games: Game[] = [];
  for (const line of lines) {
    games.push(toGame(line));
  }
  return games;
}

function readInputFileLines(inputFilePath: string): string[] {
  const lines = readFileSync(inputFilePath, 'utf8').split('\n');
  lines.pop();
  return lines;
}

function toGame(line: string): Game {
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
  return new Game(id, ballSets);
}

function sumPossibleGameIds(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    if (game.isPossible()) {
      sum += Number(game.id);
    }
  }
  return sum;
}

function sumMinBallSetPowers(games: readonly Game[]): number {
  let sum = 0;
  for (const game of games) {
    sum += game.minBallSetPower();
  }
  return sum;
}
